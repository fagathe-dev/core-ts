/**
 * GlobalContentManager
 *
 * Gère les vues globales Archives et Corbeille.
 * Hydrate les données SSR injectées en HTML (zéro AJAX au chargement),
 * pilote les onglets et les actions contextuelles.
 */

import { $ } from '@/utils';
import { createElement } from '@/utils/dom';
import { escapeHtml } from '@/utils/string';
import { ROUTES } from '@/constants/routes';
import { fetchPATCH, fetchDELETE } from '@/utils/request/fetch';
import { router } from '@/utils/request/router';
import { DateCalculator } from '@/utils/date/calculator';
import { DateFormatter } from '@/utils/date/formatter';

declare const mdb: any;

type PageType = 'archives' | 'trash';

interface GlobalNote {
  id: number;
  type: 'note';
  title: string;
  content: string;
  isPinned: boolean;
  icon: string;
  spaceName: string | null;
  spaceColor: string | null;
  updatedAt?: string;
  deletedAt?: string;
  createdAt: string;
}

interface GlobalFile {
  id: number;
  type: 'file';
  name: string;
  path: string;
  size: number;
  fileType: string;
  mimeType: string;
  isPinned: boolean;
  icon: string;
  spaceName: string | null;
  spaceColor: string | null;
  deletedAt?: string;
  createdAt: string;
}

interface GlobalTodo {
  id: number;
  type: 'todo';
  name: string;
  isCompleted: boolean;
  isImportant: boolean;
  dueDate?: string | null;
  icon: string;
  spaceName: string | null;
  spaceColor: string | null;
  deletedAt?: string;
  createdAt: string;
}

export class GlobalContentManager {
  private readonly pageType: PageType;
  private readonly rootEl: HTMLElement;
  private readonly noteContainer: HTMLElement | null;
  private readonly fileContainer: HTMLElement | null;
  private readonly todoContainer: HTMLElement | null;

  private notes: GlobalNote[] = [];
  private files: GlobalFile[] = [];
  private todos: GlobalTodo[] = [];

  constructor(rootEl: HTMLElement) {
    this.rootEl = rootEl;
    this.pageType = (rootEl.dataset.pageType as PageType) ?? 'archives';

    const prefix = this.pageType === 'trash' ? 'trash' : 'archive';
    this.noteContainer = $(
      `#${prefix}-note-container`,
      false,
    ) as HTMLElement | null;
    this.fileContainer = $(
      `#${prefix}-file-container`,
      false,
    ) as HTMLElement | null;
    this.todoContainer = $(
      `#${prefix}-todo-container`,
      false,
    ) as HTMLElement | null;

    this.init();
  }

  private init(): void {
    this.hydrateSSR();
    this.renderAll();

    if (this.pageType === 'trash') {
      this.bindEmptyTrash();
    }
  }

  // ──────────────────────────────────────────────────────
  //  HYDRATATION SSR
  // ──────────────────────────────────────────────────────

  private hydrateSSR(): void {
    const rawDataElements = this.rootEl.querySelectorAll(
      '[data-raw-data-type]',
    );

    rawDataElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const dataType = htmlEl.dataset.rawDataType;
      const rawData = htmlEl.dataset.rawData;

      if (!dataType || !rawData) return;

      try {
        const parsed = JSON.parse(rawData);

        if (dataType === 'notes') this.notes = parsed;
        else if (dataType === 'files') this.files = parsed;
        else if (dataType === 'todos') this.todos = parsed;
      } catch (error) {
        console.error(
          `[GlobalContentManager] Erreur parsing ${dataType}:`,
          error,
        );
      } finally {
        htmlEl.remove();
      }
    });
  }

  // ──────────────────────────────────────────────────────
  //  RENDU
  // ──────────────────────────────────────────────────────

  private renderAll(): void {
    this.renderNotes();
    this.renderFiles();
    this.renderTodos();
    this.initMDBDropdowns();
  }

  private renderNotes(): void {
    if (!this.noteContainer) return;
    this.noteContainer.innerHTML = '';

    if (this.notes.length === 0) {
      this.renderEmptyState(this.noteContainer, '0 note');
      return;
    }

    this.notes.forEach((note) => {
      this.noteContainer!.appendChild(this.createNoteCard(note));
    });
  }

  private renderFiles(): void {
    if (!this.fileContainer) return;
    this.fileContainer.innerHTML = '';

    if (this.files.length === 0) {
      this.renderEmptyState(this.fileContainer, '0 fichier');
      return;
    }

    this.files.forEach((file) => {
      this.fileContainer!.appendChild(this.createFileRow(file));
    });
  }

  private renderTodos(): void {
    if (!this.todoContainer) return;
    this.todoContainer.innerHTML = '';

    if (this.todos.length === 0) {
      this.renderEmptyState(this.todoContainer, '0 tâche');
      return;
    }

    this.todos.forEach((todo) => {
      this.todoContainer!.appendChild(this.createTodoRow(todo));
    });
  }

  // ──────────────────────────────────────────────────────
  //  COMPOSANTS — Note
  // ──────────────────────────────────────────────────────

  private createNoteCard(note: GlobalNote): HTMLElement {
    const wrapper = createElement('div', 'col-md-6 col-lg-4');
    wrapper.setAttribute('data-note-id', String(note.id));

    const spaceBadge = this.createSpaceBadge(note.spaceName, note.spaceColor);
    const trashInfo =
      this.pageType === 'trash' && note.deletedAt
        ? this.createTrashCountdown(note.deletedAt)
        : '';

    const actions =
      this.pageType === 'archives'
        ? this.archiveActions(note.id, 'note')
        : this.trashActions(note.id, 'note', note.title);

    wrapper.innerHTML = `
      <div class="note-card h-100">
        <div class="card-body note-content p-4 text-muted small overflow-hidden" style="max-height: 250px;">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h5 class="card-title fw-bold text-dark mb-0">${escapeHtml(note.title)}</h5>
          </div>
          <p class="text-truncate">${escapeHtml(note.content?.substring(0, 150) ?? '')}</p>
        </div>
        <div class="card-footer bg-transparent border-top border-light d-flex justify-content-between align-items-center py-3 px-4">
          <div>
            ${spaceBadge}
            ${trashInfo}
          </div>
          <div class="dropdown">
            <button class="btn btn-link text-muted p-0 action-btn-dropdown" type="button" data-mdb-dropdown-init>
              <i class="fas fa-ellipsis-v px-2"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-4">
              ${actions}
            </ul>
          </div>
        </div>
      </div>
    `;

    this.bindItemActions(wrapper, note.id, 'note', note.title);
    return wrapper;
  }

  // ──────────────────────────────────────────────────────
  //  COMPOSANTS — File
  // ──────────────────────────────────────────────────────

  private createFileRow(file: GlobalFile): HTMLElement {
    const wrapper = createElement('div', 'file-row w-100');
    wrapper.setAttribute('data-file-id', String(file.id));

    const spaceBadge = this.createSpaceBadge(file.spaceName, file.spaceColor);
    const trashInfo =
      this.pageType === 'trash' && file.deletedAt
        ? this.createTrashCountdown(file.deletedAt)
        : '';

    const actions =
      this.pageType === 'archives'
        ? this.archiveActions(file.id, 'file')
        : this.trashActions(file.id, 'file', file.name);

    const formattedSize = this.formatFileSize(file.size);

    wrapper.innerHTML = `
      <div class="file-icon text-muted me-3">
        <i class="${escapeHtml(file.icon)}"></i>
      </div>
      <div class="flex-grow-1 me-3 overflow-hidden">
        <div class="fw-bold text-dark mb-1 text-truncate">${escapeHtml(file.name)}</div>
        <small class="text-muted d-block text-truncate">
          ${formattedSize}
          ${spaceBadge ? ` · ${spaceBadge}` : ''}
          ${trashInfo ? ` · ${trashInfo}` : ''}
        </small>
      </div>
      <div class="me-4 d-none d-md-block">
        <span class="badge bg-light text-dark fw-bold border">${escapeHtml(file.fileType ?? '')}</span>
      </div>
      <div class="dropdown">
        <button class="btn btn-link text-muted p-1 action-btn-dropdown" data-mdb-dropdown-init>
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-4">
          ${actions}
        </ul>
      </div>
    `;

    this.bindItemActions(wrapper, file.id, 'file', file.name);
    return wrapper;
  }

  // ──────────────────────────────────────────────────────
  //  COMPOSANTS — Todo
  // ──────────────────────────────────────────────────────

  private createTodoRow(todo: GlobalTodo): HTMLElement {
    const wrapper = createElement(
      'div',
      'todo-row d-flex align-items-center p-2 mb-1',
    );
    wrapper.setAttribute('data-todo-id', String(todo.id));

    const spaceBadge = this.createSpaceBadge(todo.spaceName, todo.spaceColor);
    const trashInfo =
      this.pageType === 'trash' && todo.deletedAt
        ? this.createTrashCountdown(todo.deletedAt)
        : '';

    const actions =
      this.pageType === 'archives'
        ? this.archiveActions(todo.id, 'todo')
        : this.trashActions(todo.id, 'todo', todo.name);

    wrapper.innerHTML = `
      <div class="form-check mb-0 me-2">
        <input class="form-check-input" type="checkbox" ${todo.isCompleted ? 'checked' : ''} disabled />
      </div>
      <div class="flex-grow-1 me-3">
        <span class="${todo.isCompleted ? 'completed text-muted' : 'fw-medium text-dark'}">${escapeHtml(todo.name)}</span>
        <div class="small">
          ${spaceBadge}
          ${trashInfo ? ` · ${trashInfo}` : ''}
        </div>
      </div>
      ${todo.isImportant ? '<i class="fas fa-star text-warning me-2"></i>' : ''}
      <div class="dropdown">
        <button class="btn btn-link text-muted p-1 action-btn-dropdown" data-mdb-dropdown-init>
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-4">
          ${actions}
        </ul>
      </div>
    `;

    this.bindItemActions(wrapper, todo.id, 'todo', todo.name);
    return wrapper;
  }

  // ──────────────────────────────────────────────────────
  //  BADGES & COUNTDOWN
  // ──────────────────────────────────────────────────────

  private createSpaceBadge(
    spaceName: string | null,
    spaceColor: string | null,
  ): string {
    if (!spaceName) return '';

    const bgColor = spaceColor ?? '#e2e8f0';
    return `<span class="badge rounded-pill me-1" style="background-color: ${escapeHtml(bgColor)}; color: rgba(0,0,0,0.7); font-size: 0.7rem;">${escapeHtml(spaceName)}</span>`;
  }

  private createTrashCountdown(deletedAt: string): string {
    const dateSuppression = DateCalculator.modify(deletedAt, { days: 30 });
    const diff = DateCalculator.diff(new Date(), dateSuppression);
    const joursRestants = diff.days + diff.months * 30 + diff.years * 365;

    if (DateCalculator.isPast(dateSuppression)) {
      return '<span class="text-danger small fw-bold">Suppression imminente</span>';
    }

    return `<span class="text-danger small">Suppression dans ${joursRestants} jour${joursRestants > 1 ? 's' : ''}</span>`;
  }

  // ──────────────────────────────────────────────────────
  //  DROPDOWN ACTIONS
  // ──────────────────────────────────────────────────────

  private archiveActions(id: number, type: string): string {
    return `
      <li>
        <a class="dropdown-item py-2 action-restore" href="#" role="button" data-id="${id}" data-type="${type}">
          <i class="fas fa-undo-alt text-success me-2"></i> Rétablir
        </a>
      </li>
    `;
  }

  private trashActions(id: number, type: string, name: string): string {
    return `
      <li>
        <a class="dropdown-item py-2 action-restore" href="#" role="button" data-id="${id}" data-type="${type}">
          <i class="fas fa-undo-alt text-success me-2"></i> Restaurer
        </a>
      </li>
      <li><hr class="dropdown-divider"/></li>
      <li>
        <a class="dropdown-item py-2 text-danger action-hard-delete" href="#" role="button" data-id="${id}" data-type="${type}" data-name="${escapeHtml(name)}">
          <i class="fas fa-trash me-2"></i> Supprimer définitivement
        </a>
      </li>
    `;
  }

  // ──────────────────────────────────────────────────────
  //  EVENT BINDING
  // ──────────────────────────────────────────────────────

  private bindItemActions(
    wrapper: HTMLElement,
    id: number,
    type: string,
    name: string,
  ): void {
    wrapper.querySelector('.action-restore')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleRestore(id, type);
    });

    if (this.pageType === 'trash') {
      wrapper
        .querySelector('.action-hard-delete')
        ?.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleHardDelete(id, type, name);
        });
    }
  }

  private bindEmptyTrash(): void {
    const btn = $('#btn-empty-trash', false) as HTMLElement | null;
    btn?.addEventListener('click', () => this.handleEmptyTrash());
  }

  // ──────────────────────────────────────────────────────
  //  ACTIONS API
  // ──────────────────────────────────────────────────────

  private async handleRestore(id: number, type: string): Promise<void> {
    const route =
      this.pageType === 'archives'
        ? ROUTES.AJX.ARCHIVE.RESTORE
        : ROUTES.AJX.TRASH.RESTORE;

    const url = router(route, { type, id });

    try {
      await fetchPATCH(url);
      this.removeItem(id, type);
    } catch (error) {
      console.error('[GlobalContentManager] Erreur restauration:', error);
    }
  }

  private async handleHardDelete(
    id: number,
    type: string,
    name: string,
  ): Promise<void> {
    const confirmed = confirm(
      `Supprimer définitivement « ${name} » ?\nCette action est irréversible.`,
    );
    if (!confirmed) return;

    const url = router(ROUTES.AJX.TRASH.HARD_DELETE, { type, id });

    try {
      await fetchDELETE(url);
      this.removeItem(id, type);
    } catch (error) {
      console.error(
        '[GlobalContentManager] Erreur suppression définitive:',
        error,
      );
    }
  }

  private async handleEmptyTrash(): Promise<void> {
    const confirmed = confirm(
      'Vider toute la corbeille ?\nTous les éléments seront supprimés définitivement.',
    );
    if (!confirmed) return;

    try {
      await fetchDELETE(ROUTES.AJX.TRASH.EMPTY);
      this.notes = [];
      this.files = [];
      this.todos = [];
      this.renderAll();
    } catch (error) {
      console.error('[GlobalContentManager] Erreur vidage corbeille:', error);
    }
  }

  // ──────────────────────────────────────────────────────
  //  UTILITAIRES
  // ──────────────────────────────────────────────────────

  private removeItem(id: number, type: string): void {
    if (type === 'note') {
      this.notes = this.notes.filter((n) => n.id !== id);
      this.renderNotes();
    } else if (type === 'file') {
      this.files = this.files.filter((f) => f.id !== id);
      this.renderFiles();
    } else if (type === 'todo') {
      this.todos = this.todos.filter((t) => t.id !== id);
      this.renderTodos();
    }
    this.initMDBDropdowns();
  }

  private renderEmptyState(container: HTMLElement, message: string): void {
    const emptyEl = createElement('div', 'text-center text-muted py-5');
    emptyEl.innerHTML = `<i class="fas fa-inbox fa-2x mb-3 d-block opacity-50"></i><span class="fw-medium">${message}</span>`;
    container.appendChild(emptyEl);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 o';
    const units = ['o', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
  }

  private initMDBDropdowns(): void {
    this.rootEl.querySelectorAll('[data-mdb-dropdown-init]').forEach((el) => {
      try {
        new mdb.Dropdown(el);
      } catch (_) {
        /* MDB pas encore initialisé */
      }
    });
  }
}
