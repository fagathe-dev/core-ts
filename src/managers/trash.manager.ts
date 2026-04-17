/**
 * TrashManager
 *
 * Gère l'interface de la corbeille transversale :
 * - Chargement de tous les éléments supprimés via l'API
 * - Affichage en liste avec icônes distinctes par type
 * - Actions "Restaurer" et "Supprimer définitivement"
 * - Rafraîchissement du DOM après chaque action
 */

import { ROUTES } from '@/constants/routes';
import { fetchGET, fetchPATCH, fetchDELETE } from '@/utils/request/fetch';
import { router } from '@/utils/request/router';
import { DateFormatter } from '@/utils/date/formatter';
import type { TrashItem } from '@/types/index.d';

/** Labels de type traduits en français */
const TYPE_LABELS: Record<TrashItem['type'], string> = {
  note: 'Note',
  todo: 'Tâche',
  file: 'Fichier',
  folder: 'Dossier',
  space: 'Espace',
};

export class TrashManager {
  private container: HTMLElement;
  private items: TrashItem[] = [];
  private loading = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private async init(): Promise<void> {
    await this.loadItems();
  }

  // ──────────────────────────────────────────────────────
  //  CHARGEMENT DES DONNÉES
  // ──────────────────────────────────────────────────────

  private async loadItems(): Promise<void> {
    if (this.loading) return;
    this.loading = true;

    this.renderLoading();

    try {
      const response = await fetchGET<TrashItem[]>(ROUTES.AJX.TRASH.LIST);
      this.items = response.data;
      this.render();
    } catch (error) {
      console.error(
        '[TrashManager] Erreur lors du chargement de la corbeille',
        error,
      );
      this.renderError();
    } finally {
      this.loading = false;
    }
  }

  // ──────────────────────────────────────────────────────
  //  RENDU DOM
  // ──────────────────────────────────────────────────────

  private render(): void {
    this.container.innerHTML = '';

    if (this.items.length === 0) {
      this.renderEmpty();
      return;
    }

    // Header avec compteur
    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center mb-3';
    header.innerHTML = `
      <h5 class="mb-0"><i class="fas fa-trash-alt me-2 text-muted"></i>Corbeille</h5>
      <span class="badge bg-secondary">${this.items.length} élément${this.items.length > 1 ? 's' : ''}</span>
    `;
    this.container.appendChild(header);

    // Table
    const table = document.createElement('div');
    table.className = 'list-group list-group-flush';

    for (const item of this.items) {
      table.appendChild(this.createItemRow(item));
    }

    this.container.appendChild(table);
  }

  private createItemRow(item: TrashItem): HTMLElement {
    const row = document.createElement('div');
    row.className =
      'list-group-item d-flex align-items-center justify-content-between py-2 px-3';
    row.setAttribute('data-trash-id', String(item.id));
    row.setAttribute('data-trash-type', item.type);

    // Partie gauche : icône + infos
    const left = document.createElement('div');
    left.className =
      'd-flex align-items-center gap-3 flex-grow-1 overflow-hidden';

    const icon = document.createElement('i');
    icon.className = `${item.icon} fa-fw text-muted`;

    const info = document.createElement('div');
    info.className = 'overflow-hidden';

    const nameEl = document.createElement('div');
    nameEl.className = 'fw-medium text-truncate';
    nameEl.textContent = item.name;

    const meta = document.createElement('small');
    meta.className = 'text-muted';
    const typeLabel = TYPE_LABELS[item.type] || item.type;
    const spacePart = item.spaceName ? ` · ${item.spaceName}` : '';
    const datePart = item.deletedAt
      ? ` · ${DateFormatter.short(item.deletedAt)}`
      : '';
    meta.textContent = `${typeLabel}${spacePart}${datePart}`;

    info.appendChild(nameEl);
    info.appendChild(meta);
    left.appendChild(icon);
    left.appendChild(info);

    // Partie droite : boutons d'actions
    const actions = document.createElement('div');
    actions.className = 'd-flex gap-1 flex-shrink-0';

    const restoreBtn = document.createElement('button');
    restoreBtn.type = 'button';
    restoreBtn.className = 'btn btn-sm btn-outline-success';
    restoreBtn.title = 'Restaurer';
    restoreBtn.innerHTML = '<i class="fas fa-undo-alt"></i>';
    restoreBtn.addEventListener('click', () => this.handleRestore(item));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-sm btn-outline-danger';
    deleteBtn.title = 'Supprimer définitivement';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', () => this.handleHardDelete(item));

    actions.appendChild(restoreBtn);
    actions.appendChild(deleteBtn);

    row.appendChild(left);
    row.appendChild(actions);

    return row;
  }

  private renderEmpty(): void {
    this.container.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="fas fa-trash-alt fa-3x mb-3 opacity-25"></i>
        <p class="mb-0">La corbeille est vide.</p>
      </div>
    `;
  }

  private renderLoading(): void {
    this.container.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>
    `;
  }

  private renderError(): void {
    this.container.innerHTML = `
      <div class="text-center py-5 text-danger">
        <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
        <p class="mb-0">Impossible de charger la corbeille.</p>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────
  //  ACTIONS
  // ──────────────────────────────────────────────────────

  private async handleRestore(item: TrashItem): Promise<void> {
    const url = router(ROUTES.AJX.TRASH.RESTORE, {
      type: item.type,
      id: item.id,
    });

    try {
      await fetchPATCH(url);

      // Retrait optimiste de l'élément
      this.items = this.items.filter(
        (i) => !(i.id === item.id && i.type === item.type),
      );
      this.render();
    } catch (error) {
      console.error('[TrashManager] Erreur lors de la restauration', error);
    }
  }

  private async handleHardDelete(item: TrashItem): Promise<void> {
    const confirmed = confirm(
      `Supprimer définitivement « ${item.name} » ?\nCette action est irréversible.`,
    );

    if (!confirmed) return;

    const url = router(ROUTES.AJX.TRASH.HARD_DELETE, {
      type: item.type,
      id: item.id,
    });

    try {
      await fetchDELETE(url);

      // Retrait optimiste de l'élément
      this.items = this.items.filter(
        (i) => !(i.id === item.id && i.type === item.type),
      );
      this.render();
    } catch (error) {
      console.error(
        '[TrashManager] Erreur lors de la suppression définitive',
        error,
      );
    }
  }
}
