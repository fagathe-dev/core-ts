/**
 * Gestionnaire du cycle de vie de l'interface "Espace"
 * Orchestre la modale de création, la suppression et les interactions DOM liées.
 */

import { SpaceService } from '@/services/space.service';
import { FormManager } from '@/utils'; // Ton script fourni précédemment

declare const mdb: any; // MDBootstrap

export class SpaceManager {
  private createModalEl: HTMLElement | null;
  private createFormEl: HTMLFormElement | null;
  private createModalInstance: any;
  private formManager: FormManager | null = null;

  constructor() {
    this.createModalEl = document.getElementById('spaceCreationModal');
    this.createFormEl = document.getElementById(
      'formCreateSpace',
    ) as HTMLFormElement;

    this.init();
  }

  private init() {
    // --- 1. GESTION DE LA MODALE DE CRÉATION (reset à la fermeture) ---
    if (this.createModalEl && this.createFormEl) {
      this.createModalInstance = new mdb.Modal(this.createModalEl);
      this.formManager = new FormManager({ form: this.createFormEl });

      // La soumission du formulaire est gérée par SidebarListManager.
      // Ici on ne gère que le nettoyage à la fermeture de la modale.
      this.createModalEl.addEventListener('hidden.mdb.modal', () => {
        this.formManager?.reset();
      });
    }

    // --- 2. GESTION DE LA SUPPRESSION (Page app_space_show) ---
    const deleteBtn = document.getElementById('btn-delete-space');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', this.handleDeleteRequest.bind(this));
    }
  }

  /**
   * Gère la modale de confirmation et la suppression AJAX
   */
  private async handleDeleteRequest(e: Event) {
    e.preventDefault();
    const btn = e.currentTarget as HTMLElement;
    const spaceId = btn.getAttribute('data-space-id');
    const spaceName = btn.getAttribute('data-space-name');

    if (!spaceId) return;

    // Note: Dans l'idéal, on utilise une modale MDB ici, mais un prompt natif
    // ou une modale custom fait l'affaire selon tes besoins de sécurité.
    const userInput = prompt(
      `⚠️ ZONE DE DANGER\nPour supprimer définitivement cet espace, veuillez taper son nom exact :\n"${spaceName}"`,
    );

    if (userInput !== spaceName) {
      if (userInput !== null)
        alert('Le nom saisi ne correspond pas. Annulation.');
      return;
    }

    try {
      // Affichage loader sur le bouton
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
      btn.classList.add('disabled');

      await SpaceService.delete(spaceId);

      // Redirection vers l'accueil après suppression
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
      alert("Erreur lors de la suppression de l'espace.");
      btn.innerHTML = '<i class="fas fa-trash-alt me-2"></i> Supprimer';
      btn.classList.remove('disabled');
    }
  }
}
