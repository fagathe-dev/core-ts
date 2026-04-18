import { SelectableOptions } from '@/types/index.d';

class SelectableField {
  private items: NodeListOf<HTMLElement>;
  private observer: MutationObserver | null = null;

  /**
   * @param container Le conteneur .form-selectable rendu par Twig
   * @param options Mode radio (forcé) ou nullable (checkbox classique)
   */
  constructor(
    private container: HTMLElement,
    private options: SelectableOptions = { mode: 'radio' },
  ) {
    this.items = this.container.querySelectorAll('.form-selectable-item');
    this.init();
  }

  private init(): void {
    // 1. Configurer un observateur pour la gestion des erreurs du FormManager
    // FormManager ajoute "is-invalid" ou "is-valid" directement sur l'input.
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const input = mutation.target as HTMLInputElement;
          const item = input.closest('.form-selectable-item') as HTMLElement;

          if (item) {
            // On répercute les classes de validation sur l'élément visuel
            item.classList.toggle(
              'is-invalid',
              input.classList.contains('is-invalid'),
            );
            item.classList.toggle(
              'is-valid',
              input.classList.contains('is-valid'),
            );
          }
        }
      });
    });

    this.items.forEach((item) => {
      const input = item.querySelector(
        '.form-selectable-input',
      ) as HTMLInputElement;

      // On observe les changements de classes sur cet input caché
      if (this.observer) {
        this.observer.observe(input, {
          attributes: true,
          attributeFilter: ['class'],
        });
      }

      // 2. Écouter les événements natifs déclenchés par FormManager (fillData, reset)
      input.addEventListener('input', () => this.syncVisualState());
      input.addEventListener('change', () => this.syncVisualState());

      // 3. Gérer le clic physique de l'utilisateur sur la pastille
      item.addEventListener('click', (e) => {
        e.preventDefault(); // Empêche le comportement par défaut si c'est encapsulé dans un <label>
        this.handleSelection(item, input);
      });
    });

    // 4. Synchronisation initiale (pour les attributs "checked" rendus par Twig)
    this.syncVisualState();
  }

  /**
   * Synchronise la classe CSS .active en fonction de la propriété checked réelle des inputs.
   */
  private syncVisualState(): void {
    this.items.forEach((item) => {
      const input = item.querySelector(
        '.form-selectable-input',
      ) as HTMLInputElement;
      item.classList.toggle('active', input.checked);
    });
  }

  private handleSelection(
    clickedItem: HTMLElement,
    clickedInput: HTMLInputElement,
  ): void {
    const wasChecked = clickedInput.checked;

    if (this.options.mode === 'radio') {
      // MODE RADIO : Une sélection est obligatoire, on ne peut pas la désélectionner
      if (wasChecked) return;

      // Décocher tous les autres inputs frères (ceux appartenant au même SelectableField)
      this.items.forEach((item) => {
        const input = item.querySelector(
          '.form-selectable-input',
        ) as HTMLInputElement;
        if (input !== clickedInput && input.checked) {
          input.checked = false;
          // On avertit le système que cette valeur a changé (utile pour des validations en temps réel)
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      clickedInput.checked = true;
    } else {
      // MODE NULLABLE : Comportement classique de checkbox
      clickedInput.checked = !wasChecked;
    }

    // Déclenche l'événement pour que le FormManager.getData() et autres listeners captent le changement
    clickedInput.dispatchEvent(new Event('input', { bubbles: true }));
    clickedInput.dispatchEvent(new Event('change', { bubbles: true }));

    if (this.options.onSelect) {
      this.options.onSelect(clickedInput.checked ? clickedInput.value : null);
    }
  }

  /**
   * Utile si le composant est retiré du DOM pour éviter les fuites mémoire
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export { SelectableField };
