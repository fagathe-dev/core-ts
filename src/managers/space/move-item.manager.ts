/**
 * MoveItemManager — Modale unifiée de déplacement d'éléments (File, Note, Todo).
 *
 * - Note/Todo : sélecteur d'Espaces uniquement
 * - File : sélecteur d'Espaces + chargement dynamique des Dossiers
 *
 * Après déplacement réussi, l'élément est retiré du DOM.
 */

import { ROUTES } from '@/constants';
import { fetchGET, fetchPATCH } from '@/utils/request/fetch';
import { router } from '@/utils';
import { escapeHtml } from '@/utils/string';
import type { Space, Folder } from '@/types';

declare const mdb: any;

type MoveItemType = 'file' | 'note' | 'todo';

interface MoveRequest {
  type: MoveItemType;
  id: number;
  name: string;
  currentSpaceId: number;
  element: HTMLElement;
}

export class MoveItemManager {
  private static instance: MoveItemManager | null = null;
  private modal: any | null = null;
  private modalEl: HTMLElement | null = null;
  private currentRequest: MoveRequest | null = null;

  // Cache des espaces pour éviter les requêtes répétées dans la même session
  private spacesCache: Space[] | null = null;

  private constructor() {
    this.createModal();
  }

  static getInstance(): MoveItemManager {
    if (!MoveItemManager.instance) {
      MoveItemManager.instance = new MoveItemManager();
    }
    return MoveItemManager.instance;
  }

  /**
   * Ouvre la modale de déplacement pour un élément donné.
   */
  open(request: MoveRequest): void {
    this.currentRequest = request;
    this.renderLoading();
    this.modal?.show();
    this.loadDestinations();
  }

  // ──────────────────────────────────────────────────────
  //  CONSTRUCTION DE LA MODALE
  // ──────────────────────────────────────────────────────

  private createModal(): void {
    // Éviter les doublons
    const existing = document.getElementById('move-item-modal');
    if (existing) {
      this.modalEl = existing;
      this.modal = new mdb.Modal(this.modalEl);
      return;
    }

    this.modalEl = document.createElement('div');
    this.modalEl.id = 'move-item-modal';
    this.modalEl.className = 'modal fade';
    this.modalEl.setAttribute('tabindex', '-1');
    this.modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content rounded-4 shadow">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold" id="move-modal-title">Déplacer</h5>
            <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Fermer"></button>
          </div>
          <div class="modal-body" id="move-modal-body">
          </div>
          <div class="modal-footer border-top-0 pt-0">
            <button type="button" class="btn btn-link text-muted" data-mdb-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary rounded-pill px-4" id="move-modal-confirm" disabled>
              <i class="fas fa-arrows-alt me-1"></i> Déplacer
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
    this.modal = new mdb.Modal(this.modalEl);

    // Bind du bouton Confirmer
    this.modalEl
      .querySelector('#move-modal-confirm')
      ?.addEventListener('click', () => this.handleConfirm());
  }

  // ──────────────────────────────────────────────────────
  //  CHARGEMENT DES DONNÉES
  // ──────────────────────────────────────────────────────

  private renderLoading(): void {
    const body = this.modalEl?.querySelector('#move-modal-body');
    if (!body) return;
    body.innerHTML = `
      <div class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>
    `;
  }

  private async loadDestinations(): Promise<void> {
    try {
      if (!this.spacesCache) {
        const response = await fetchGET<Space[]>(ROUTES.AJX.MOVE.DESTINATIONS);
        this.spacesCache = response.data;
      }

      this.renderSpaceSelector(this.spacesCache);
    } catch (error) {
      console.error('Erreur lors du chargement des destinations :', error);
      this.renderError('Impossible de charger les espaces.');
    }
  }

  // ──────────────────────────────────────────────────────
  //  RENDU
  // ──────────────────────────────────────────────────────

  private renderSpaceSelector(spaces: Space[]): void {
    const body = this.modalEl?.querySelector('#move-modal-body');
    const title = this.modalEl?.querySelector('#move-modal-title');
    if (!body || !this.currentRequest) return;

    if (title) {
      title.textContent = `Déplacer « ${this.currentRequest.name} »`;
    }

    // Filtrer : proposer tous les espaces sauf exclure rien (on les affiche tous, l'actuel sera marqué)
    const currentSpaceId = this.currentRequest.currentSpaceId;

    let html = `<p class="text-muted small mb-3">Choisissez l'espace de destination :</p>`;
    html += `<div class="list-group list-group-light" id="move-space-list">`;

    for (const space of spaces) {
      const isCurrent = space.id === currentSpaceId;
      const activeClass = isCurrent ? ' active' : '';
      const badge = isCurrent
        ? '<span class="badge bg-primary rounded-pill ms-auto">Actuel</span>'
        : '';
      const icon = space.isCapsule ? 'fas fa-lock' : 'fas fa-layer-group';
      const colorClass = space.color
        ? `text-${escapeHtml(space.color)}`
        : 'text-primary';

      html += `
        <button type="button" 
          class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 move-space-option${activeClass}"
          data-space-id="${space.id}">
          <i class="${icon} ${colorClass}"></i>
          <span class="fw-medium">${escapeHtml(space.name)}</span>
          ${badge}
        </button>
      `;
    }

    html += `</div>`;

    // Si c'est un fichier, on ajoute un conteneur pour les dossiers
    if (this.currentRequest.type === 'file') {
      html += `<div id="move-folder-section" class="mt-3" style="display: none;"></div>`;
    }

    body.innerHTML = html;

    // Bind des clics sur les espaces
    body.querySelectorAll('.move-space-option').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const spaceId = parseInt(target.dataset.spaceId ?? '0', 10);

        // Retirer l'état sélectionné des autres
        body
          .querySelectorAll('.move-space-option')
          .forEach((el) => el.classList.remove('selected', 'border-primary'));
        target.classList.add('selected', 'border-primary');

        // Pour File, charger les dossiers
        if (this.currentRequest?.type === 'file') {
          this.loadFolders(spaceId);
        }

        this.updateConfirmButton();
      });
    });
  }

  private async loadFolders(spaceId: number): Promise<void> {
    const section = this.modalEl?.querySelector(
      '#move-folder-section',
    ) as HTMLElement | null;
    if (!section) return;

    section.style.display = 'block';
    section.innerHTML = `
      <div class="text-center py-2">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>
    `;

    try {
      const response = await fetchGET<Folder[]>(
        router(ROUTES.AJX.MOVE.FOLDERS, { id: spaceId }),
      );
      this.renderFolderSelector(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers :', error);
      section.innerHTML = `<p class="text-danger small">Impossible de charger les dossiers.</p>`;
    }
  }

  private renderFolderSelector(folders: Folder[]): void {
    const section = this.modalEl?.querySelector(
      '#move-folder-section',
    ) as HTMLElement | null;
    if (!section) return;

    let html = `<p class="text-muted small mb-2">Dossier de destination (optionnel) :</p>`;
    html += `<div class="list-group list-group-light" id="move-folder-list">`;

    // Option "À la racine"
    html += `
      <button type="button"
        class="list-group-item list-group-item-action d-flex align-items-center gap-2 py-2 move-folder-option selected border-primary"
        data-folder-id="">
        <i class="fas fa-home text-muted"></i>
        <span>À la racine</span>
      </button>
    `;

    for (const folder of folders) {
      html += `
        <button type="button"
          class="list-group-item list-group-item-action d-flex align-items-center gap-2 py-2 move-folder-option"
          data-folder-id="${folder.id}">
          <i class="fas fa-folder text-warning"></i>
          <span>${escapeHtml(folder.name)}</span>
        </button>
      `;
    }

    html += `</div>`;
    section.innerHTML = html;

    // Bind des clics sur les dossiers
    section.querySelectorAll('.move-folder-option').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        section
          .querySelectorAll('.move-folder-option')
          .forEach((el) => el.classList.remove('selected', 'border-primary'));
        target.classList.add('selected', 'border-primary');
      });
    });
  }

  private renderError(message: string): void {
    const body = this.modalEl?.querySelector('#move-modal-body');
    if (!body) return;
    body.innerHTML = `<p class="text-danger text-center py-3">${escapeHtml(message)}</p>`;
  }

  // ──────────────────────────────────────────────────────
  //  LOGIQUE DE CONFIRMATION
  // ──────────────────────────────────────────────────────

  private updateConfirmButton(): void {
    const confirmBtn = this.modalEl?.querySelector(
      '#move-modal-confirm',
    ) as HTMLButtonElement | null;
    if (!confirmBtn) return;

    const selectedSpace = this.modalEl?.querySelector(
      '.move-space-option.selected',
    );
    confirmBtn.disabled = !selectedSpace;
  }

  private async handleConfirm(): Promise<void> {
    if (!this.currentRequest) return;

    const selectedSpaceBtn = this.modalEl?.querySelector(
      '.move-space-option.selected',
    ) as HTMLElement | null;
    if (!selectedSpaceBtn) return;

    const spaceId = parseInt(selectedSpaceBtn.dataset.spaceId ?? '0', 10);

    // Construire le payload
    const payload: { spaceId: number; folderId?: number | null } = { spaceId };

    if (this.currentRequest.type === 'file') {
      const selectedFolderBtn = this.modalEl?.querySelector(
        '.move-folder-option.selected',
      ) as HTMLElement | null;
      const folderId = selectedFolderBtn?.dataset.folderId;
      payload.folderId = folderId ? parseInt(folderId, 10) : null;
    }

    // Désactiver le bouton pour éviter les doublons
    const confirmBtn = this.modalEl?.querySelector(
      '#move-modal-confirm',
    ) as HTMLButtonElement;
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Déplacement...`;
    }

    try {
      await fetchPATCH(
        router(ROUTES.AJX.MOVE.ITEM, {
          type: this.currentRequest.type,
          id: this.currentRequest.id,
        }),
        payload,
      );

      // Retirer l'élément du DOM
      this.currentRequest.element.remove();

      // Fermer la modale
      this.modal?.hide();

      // Invalider le cache pour forcer le rechargement
      this.spacesCache = null;
    } catch (error) {
      console.error('Erreur lors du déplacement :', error);

      // Réactiver le bouton
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `<i class="fas fa-arrows-alt me-1"></i> Déplacer`;
      }

      this.renderError('Échec du déplacement. Vérifiez vos droits.');
    }
  }
}
