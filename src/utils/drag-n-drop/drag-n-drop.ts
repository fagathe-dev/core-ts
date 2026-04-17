/**
 * Utilitaire agnostique pour le Drag & Drop natif (HTML5).
 * Utilise la délégation d'événements sur un conteneur principal.
 */

export interface DragNDropOptions {
  container: string | HTMLElement;
  itemSelector: string; // Ex: '.file-row'
  dropTargetSelector?: string; // Ex: '.folder-row, #drive-root-container'
  onDragStart?: (event: DragEvent, draggedElement: HTMLElement) => void;
  onDragEnd?: (event: DragEvent, draggedElement: HTMLElement) => void;
  onDrop?: (
    event: DragEvent,
    draggedElement: HTMLElement,
    targetElement: HTMLElement,
  ) => void;
  onAbort?: (event: DragEvent, draggedElement: HTMLElement) => void;
}

export class DragNDrop {
  private container: HTMLElement | null;
  private draggedElement: HTMLElement | null = null;
  private dropTargetSelector: string;
  private isDropped: boolean = false;

  constructor(private options: DragNDropOptions) {
    this.container =
      typeof options.container === 'string'
        ? document.querySelector(options.container)
        : options.container;

    // Si aucun sélecteur de cible n'est fourni, on considère qu'on peut déposer sur un autre élément de la liste
    this.dropTargetSelector =
      options.dropTargetSelector || options.itemSelector;

    if (this.container) {
      this.init();
    } else {
      console.warn(`DragNDrop: Conteneur introuvable`, options.container);
    }
  }

  private init(): void {
    if (!this.container) return;

    this.container.addEventListener(
      'dragstart',
      this.handleDragStart.bind(this),
    );
    this.container.addEventListener('dragend', this.handleDragEnd.bind(this));
    this.container.addEventListener('dragover', this.handleDragOver.bind(this));
    this.container.addEventListener(
      'dragleave',
      this.handleDragLeave.bind(this),
    );
    this.container.addEventListener('drop', this.handleDrop.bind(this));
  }

  private handleDragStart(e: DragEvent): void {
    const target = e.target as HTMLElement;

    // Vérifie si l'élément qu'on commence à glisser correspond à notre sélecteur
    if (target.matches && target.matches(this.options.itemSelector)) {
      this.draggedElement = target;
      this.isDropped = false;

      // Requis pour que Firefox autorise le drag & drop
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', 'dummy_data');
      }

      // Léger délai pour permettre à l'image fantôme native de se générer avant d'appliquer une opacité
      setTimeout(() => this.draggedElement?.classList.add('dragging'), 0);

      if (this.options.onDragStart) {
        this.options.onDragStart(e, this.draggedElement);
      }
    }
  }

  private handleDragEnd(e: DragEvent): void {
    if (!this.draggedElement) return;

    this.draggedElement.classList.remove('dragging');

    if (this.options.onDragEnd) {
      this.options.onDragEnd(e, this.draggedElement);
    }

    // Si le drag s'est terminé sans drop valide
    if (!this.isDropped && this.options.onAbort) {
      this.options.onAbort(e, this.draggedElement);
    }

    this.draggedElement = null;
  }

  private handleDragOver(e: DragEvent): void {
    const target = (e.target as HTMLElement).closest(
      this.dropTargetSelector,
    ) as HTMLElement;

    // On autorise le drop uniquement si la cible est valide et différente de l'élément glissé lui-même
    if (target && this.draggedElement && target !== this.draggedElement) {
      e.preventDefault(); // Indispensable pour autoriser le "drop"

      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
      target.classList.add('drag-over');
    }
  }

  private handleDragLeave(e: DragEvent): void {
    const target = (e.target as HTMLElement).closest(
      this.dropTargetSelector,
    ) as HTMLElement;
    if (target) {
      target.classList.remove('drag-over');
    }
  }

  private handleDrop(e: DragEvent): void {
    const target = (e.target as HTMLElement).closest(
      this.dropTargetSelector,
    ) as HTMLElement;

    if (target && this.draggedElement && target !== this.draggedElement) {
      e.preventDefault();
      e.stopPropagation(); // Évite le déclenchement en cascade si des DropZones sont imbriquées

      target.classList.remove('drag-over');
      this.isDropped = true;

      if (this.options.onDrop) {
        this.options.onDrop(e, this.draggedElement, target);
      }
    }
  }
}
