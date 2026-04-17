/**
 * Gestionnaire de la vue Espace (Space Show)
 * Orchestre les onglets, le FAB contextuel, le chargement des données et l'injection des composants.
 */

import { $, createElement } from '@/utils';
import {
  TodoComponent,
  FolderComponent,
  FileComponent,
  NoteComponent,
} from '@/components';
import type { NoteActions } from '@/components/Note';
import type { FolderProps } from '@/components/Folder';
import type { FileProps } from '@/components/File';
import { NoteService } from '@/services/note.service';
import { TodoService } from '@/services/todo.service';
import { UploaderManager } from '@/managers/space/uploader.manager';
import { enrichFileProps } from '@/utils/file';
import type { Todo, Note } from '@/types';

declare const mdb: any;

export class SpaceViewManager {
  private readonly spaceId: string;
  private readonly todoContainer: HTMLElement | null;
  private readonly folderContainer: HTMLElement | null;
  private readonly fileContainer: HTMLElement | null;
  private readonly noteContainer: HTMLElement | null;
  private readonly importantTodosContainer: HTMLElement | null;
  private readonly importantMixedContainer: HTMLElement | null;
  private uploaderManager: UploaderManager | null = null;

  constructor(rootEl: HTMLElement) {
    this.spaceId = rootEl.getAttribute('data-space-id') ?? '';

    this.todoContainer = $('#todo-container', false) as HTMLElement | null;
    this.folderContainer = $('#folder-container', false) as HTMLElement | null;
    this.fileContainer = $('#file-container', false) as HTMLElement | null;
    this.noteContainer = $('#note-container', false) as HTMLElement | null;
    this.importantTodosContainer = $(
      '#important-todos-container',
      false,
    ) as HTMLElement | null;
    this.importantMixedContainer = $(
      '#important-mixed-container',
      false,
    ) as HTMLElement | null;

    this.init();
  }

  private init(): void {
    this.setupFAB();
    this.setupAddTodo();
    this.setupAddNote();
    this.setupFabFileActions();
    this.setupFabNoteActions();
    this.listenPinnedStateChanges();
    this.loadData();
  }

  /**
   * Gestion du FAB contextuel selon l'onglet actif
   */
  private setupFAB(): void {
    const tabLinks = document.querySelectorAll('a[data-mdb-tab-init]');
    const fabContainer = document.getElementById('contextual-fab');
    const fabMenuGroups = document.querySelectorAll('.fab-menu-group');

    tabLinks.forEach((link) => {
      link.addEventListener('shown.mdb.tab', (e: Event) => {
        const target = e.target as HTMLElement;
        const context = target.getAttribute('data-fab-context');

        if (!fabContainer) return;

        if (context === 'none') {
          fabContainer.style.display = 'none';
        } else {
          fabContainer.style.display = 'block';
          fabMenuGroups.forEach((group) => group.classList.remove('active'));
          const activeGroup = document.getElementById(`fab-menu-${context}`);
          if (activeGroup) activeGroup.classList.add('active');
        }
      });
    });
  }

  /**
   * Ajout dynamique de tâche (Onglet Tâches)
   */
  private setupAddTodo(): void {
    const newTodoInput = document.getElementById(
      'new-todo-input',
    ) as HTMLInputElement | null;
    const btnAddTodo = document.getElementById('btn-add-todo');

    const handleAdd = async () => {
      if (!newTodoInput) return;
      const val = newTodoInput.value.trim();
      if (!val) return;

      try {
        const newTodo = await TodoService.create(this.spaceId, { name: val });
        this.todoContainer?.prepend(new TodoComponent(newTodo).getElement());
        newTodoInput.value = '';
      } catch (error) {
        console.error('Erreur lors de la création de la tâche :', error);
      }
    };

    btnAddTodo?.addEventListener('click', handleAdd);
    newTodoInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAdd();
    });
  }

  /**
   * Ajout dynamique de note (Onglet Notes)
   */
  private setupAddNote(): void {
    const noteTitleInput = document.getElementById(
      'new-note-title',
    ) as HTMLInputElement | null;
    const noteContentInput = document.getElementById(
      'new-note-content',
    ) as HTMLTextAreaElement | null;
    const btnAddNote = document.getElementById('btn-add-note');

    btnAddNote?.addEventListener('click', async () => {
      const title = noteTitleInput?.value.trim() ?? '';
      const content = noteContentInput?.value.trim() ?? '';

      if (!title && !content) return;

      try {
        const newNote = await NoteService.create(this.spaceId, {
          title,
          content,
        });
        this.removeEmptyState(this.noteContainer);
        const component = new NoteComponent(newNote, this.getNoteActions());
        this.noteContainer?.prepend(component.getElement());

        if (noteTitleInput) noteTitleInput.value = '';
        if (noteContentInput) noteContentInput.value = '';
      } catch (error) {
        console.error('Erreur lors de la création de la note :', error);
      }
    });
  }

  /**
   * Actions contextuelles partagées pour toutes les NoteComponent
   */
  private getNoteActions(): NoteActions {
    return {
      onEdit: (note: Note) => {
        // Fix 7 : Redirection vers la page d'édition de la note
        window.location.href = `/app/note/${note.id}/edit`;
      },
      onPin: async (note: Note) => {
        try {
          const updated = await NoteService.togglePin(note.id);
          // Re-render du composant
          const el = this.noteContainer?.querySelector(
            `[data-note-id="${note.id}"]`,
          );
          if (el) {
            const component = new NoteComponent(updated, this.getNoteActions());
            el.replaceWith(component.getElement());
          }
          // Fix 4 : Émet l'événement pour mettre à jour l'onglet Important
          document.dispatchEvent(
            new CustomEvent('itemPinnedStateChanged', {
              detail: { type: 'note', item: updated },
            }),
          );
        } catch (error) {
          console.error('Erreur lors du toggle pin :', error);
        }
      },
      onArchive: async (note: Note) => {
        try {
          await NoteService.update(note.id, { state: 'archive' });
          this.noteContainer
            ?.querySelector(`[data-note-id="${note.id}"]`)
            ?.remove();
        } catch (error) {
          console.error("Erreur lors de l'archivage :", error);
        }
      },
      onDelete: async (note: Note) => {
        try {
          await NoteService.update(note.id, { state: 'trash' });
          this.noteContainer
            ?.querySelector(`[data-note-id="${note.id}"]`)
            ?.remove();
        } catch (error) {
          console.error('Erreur lors de la suppression :', error);
        }
      },
    };
  }

  /**
   * Chargement des données injectées dans le DOM (Hydratation SSR) sans appel réseau.
   */
  private loadData(): void {
    const rawDataElements = document.querySelectorAll('[data-raw-data-type]');

    rawDataElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const dataType = htmlEl.dataset.rawDataType;
      const rawData = htmlEl.dataset.rawData;

      if (!dataType || !rawData) return;

      try {
        const parsedData = JSON.parse(rawData);

        // 1. Stockage en cache (Session Storage)
        sessionStorage.setItem(`space_${this.spaceId}_${dataType}`, rawData);

        console.log({ dataType, parsedData });

        // 2. Rendu des composants par domaine
        if (dataType === 'todos') {
          const todos: Todo[] = parsedData;
          todos.forEach((t) => {
            this.todoContainer?.appendChild(new TodoComponent(t).getElement());
            if (t.isImportant) {
              this.importantTodosContainer?.appendChild(
                new TodoComponent(t).getElement(),
              );
            }
          });
        } else if (dataType === 'files') {
          // Les fichiers retournent { files: [], folders: [] } selon le Service PHP
          const folders: FolderProps[] = parsedData.folders || [];
          const files: FileProps[] = parsedData.files || [];

          folders.forEach((f) => {
            const folderEl = new FolderComponent(f).getElement();
            this.folderContainer?.appendChild(folderEl);

            // Injecter les fichiers enfants dans le dossier
            const folderFiles = (f as any).files || [];
            if (folderFiles.length > 0) {
              const filesContainer = folderEl.querySelector(
                '.folder-files-container',
              );
              folderFiles.forEach((rawFile: any) => {
                const fileProps = enrichFileProps(rawFile);
                filesContainer?.appendChild(
                  new FileComponent(fileProps).getElement(),
                );
              });
            }
          });
          files.forEach((f) => {
            this.fileContainer?.appendChild(new FileComponent(f).getElement());
            if (f.isPinned) {
              this.importantMixedContainer?.appendChild(
                new FileComponent(f).getElement(),
              );
            }
          });

          // Afficher le conteneur de fichiers uniquement s'il y a des fichiers racine
          if (this.fileContainer) {
            this.fileContainer.style.display = files.length > 0 ? '' : 'none';
          }
        } else if (dataType === 'notes') {
          const notes: Note[] = parsedData;
          const noteActions = this.getNoteActions();
          notes.forEach((n) => {
            this.noteContainer?.appendChild(
              new NoteComponent(n, noteActions).getElement(),
            );
            if (n.isPinned) {
              this.importantMixedContainer?.appendChild(
                new NoteComponent(n, noteActions).getElement(),
              );
            }
          });

          // Fix 3 : Empty state si aucune note
          if (notes.length === 0) {
            this.renderEmptyState(this.noteContainer, '0 note');
          }
        }
      } catch (error) {
        console.error(
          `Erreur de parsing des données injectées pour ${dataType}:`,
          error,
        );
      } finally {
        // 3. Nettoyage du DOM : On supprime la balise <div> data-holder qui n'est plus utile
        htmlEl.remove();
      }
    });

    // Initialiser tous les dropdowns MDB dans la vue
    this.initMDBDropdowns();

    // Initialiser UploaderManager pour le drag and drop et l'upload via input
    if (this.fileContainer) {
      this.uploaderManager = new UploaderManager({
        spaceId: this.spaceId,
        dropZone: this.fileContainer,
        fileContainer: this.fileContainer,
      });
    }
  }

  /**
   * Affiche un message vide si le conteneur ne contient aucun enfant visible.
   */
  private renderEmptyState(
    container: HTMLElement | null,
    message: string,
  ): void {
    if (!container || container.children.length > 0) return;

    const emptyEl = createElement('div', 'text-center text-muted py-5');
    emptyEl.setAttribute('data-empty-state', 'true');
    emptyEl.innerHTML = `<i class="fas fa-inbox fa-2x mb-3 d-block opacity-50"></i><span class="fw-medium">${message}</span>`;
    container.appendChild(emptyEl);
  }

  /**
   * Supprime l'empty state d'un conteneur si présent.
   */
  private removeEmptyState(container: HTMLElement | null): void {
    container?.querySelector('[data-empty-state]')?.remove();
  }

  /**
   * Fix 5 : Actions du FAB sur l'onglet Fichiers (Créer dossier + Importer fichier)
   */
  private setupFabFileActions(): void {
    const fabFilesGroup = document.getElementById('fab-menu-files');
    if (!fabFilesGroup) return;

    const items = fabFilesGroup.querySelectorAll('.dropdown-item');

    // Premier item : Créer un dossier
    items[0]?.addEventListener('click', (e) => {
      e.preventDefault();
      const name = prompt('Nom du nouveau dossier :');
      if (!name?.trim()) return;

      import('@/utils/request/fetch').then(({ fetchPOST }) => {
        import('@/utils').then(({ router }) => {
          import('@/constants').then(({ ROUTES }) => {
            fetchPOST(router(ROUTES.AJX.FOLDER.CREATE, { id: this.spaceId }), {
              name: name.trim(),
            })
              .then((res: any) => {
                const folder = res.data;
                this.removeEmptyState(this.fileContainer);
                this.folderContainer?.prepend(
                  new FolderComponent(folder).getElement(),
                );
              })
              .catch((err: unknown) =>
                console.error('Erreur création dossier :', err),
              );
          });
        });
      });
    });

    // Second item : Importer un fichier
    items[1]?.addEventListener('click', (e) => {
      e.preventDefault();
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.style.display = 'none';
      input.addEventListener('change', () => {
        if (this.uploaderManager) {
          this.uploaderManager.handleInputChange(input);
        }
        input.remove();
      });
      document.body.appendChild(input);
      input.click();
    });
  }

  /**
   * Fix 6 : Le FAB Notes est un lien HTML natif défini dans le template Twig.
   * Aucune action JS nécessaire — la navigation se fait via le href.
   */
  private setupFabNoteActions(): void {
    // Intentionnellement vide : le FAB Notes est un <a> avec href dans le template Twig.
  }

  /**
   * Fix 4 : Écoute les changements d'état épinglé pour mettre à jour l'onglet Important en temps réel.
   */
  private listenPinnedStateChanges(): void {
    document.addEventListener('itemPinnedStateChanged', ((
      e: CustomEvent<{ type: string; item: any }>,
    ) => {
      const { type, item } = e.detail;

      if (type === 'todo') {
        const existing = this.importantTodosContainer?.querySelector(
          `.todo-row[data-todo-id="${item.id}"]`,
        );

        if (item.isImportant) {
          if (!existing) {
            this.importantTodosContainer?.appendChild(
              new TodoComponent(item).getElement(),
            );
          }
        } else {
          existing?.remove();
        }
      } else if (type === 'note') {
        const existing = this.importantMixedContainer?.querySelector(
          `[data-note-id="${item.id}"]`,
        );

        if (item.isPinned) {
          if (!existing) {
            this.importantMixedContainer?.appendChild(
              new NoteComponent(item, this.getNoteActions()).getElement(),
            );
          }
        } else {
          existing?.remove();
        }
      } else if (type === 'file') {
        const existing = this.importantMixedContainer?.querySelector(
          `[data-file-id="${item.id}"]`,
        );

        if (item.isPinned) {
          if (!existing) {
            this.importantMixedContainer?.appendChild(
              new FileComponent(item).getElement(),
            );
          }
        } else {
          existing?.remove();
        }
      }
    }) as EventListener);
  }

  /**
   * Initialise les composants Dropdown de MDBootstrap
   */
  private initMDBDropdowns(): void {
    document.querySelectorAll('[data-mdb-dropdown-init]').forEach((el) => {
      try {
        new mdb.Dropdown(el);
      } catch (_) {
        /* MDB pas encore initialisé */
      }
    });
  }
}
