import { fetchPATCH, fetchDELETE } from '@/utils/request/fetch';
import { FormManager, SelectableField, router } from '@/utils';
import { ROUTES } from '@/constants/routes';

export class SpaceSettingsManager {
  private spaceId: number;
  private spaceName: string;

  constructor(spaceId: number, spaceName: string) {
    this.spaceId = spaceId;
    this.spaceName = spaceName;
    this.init();
  }

  private init() {
    // --- 1. MODIFICATION DES PARAMÈTRES ---
    const updateForm = document.getElementById(
      'spaceUpdateForm',
    ) as HTMLFormElement;
    if (updateForm) {
      const formManager = new FormManager({
        form: updateForm,
        initialData: {},
      });

      // Initialisation du sélecteur visuel pour la couleur
      const colorContainer = document.getElementById('update-color-selector');
      if (colorContainer)
        new SelectableField(colorContainer, { mode: 'radio' });

      updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = updateForm.querySelector(
          'button[type="submit"]',
        ) as HTMLButtonElement;
        const originalText = btn.innerHTML;

        try {
          btn.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2"></span>Enregistrement...';
          btn.disabled = true;

          const data = formManager.getData();
          const payload = {
            name: data.name,
            description: data.description,
            // FormManager retourne un tableau pour les checkbox/radio, on l'aplatit
            color: Array.isArray(data.color) ? data.color[0] : data.color,
          };

          await fetchPATCH(
            router(ROUTES.AJX.SPACE.UPDATE, { id: this.spaceId }),
            payload,
          );

          // On recharge la page pour voir les changements dans la Sidebar Twig et le Header
          window.location.reload();
        } catch (error) {
          console.error('Erreur de mise à jour', error);
          alert('Une erreur est survenue lors de la sauvegarde.');
        } finally {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      });
    }

    // --- 2. HARD DELETE ---
    const btnInitHardDelete = document.getElementById('btnInitHardDelete');
    const hardDeleteConfirmBlock = document.getElementById(
      'hardDeleteConfirmBlock',
    );
    const hardDeleteConfirmInput = document.getElementById(
      'hardDeleteConfirmInput',
    ) as HTMLInputElement;
    const btnFinalHardDelete = document.getElementById(
      'btnFinalHardDelete',
    ) as HTMLButtonElement;

    if (
      btnInitHardDelete &&
      hardDeleteConfirmBlock &&
      hardDeleteConfirmInput &&
      btnFinalHardDelete
    ) {
      btnInitHardDelete.addEventListener('click', () => {
        hardDeleteConfirmBlock.classList.remove('d-none');
        btnInitHardDelete.classList.add('d-none');
        hardDeleteConfirmInput.focus();
      });

      hardDeleteConfirmInput.addEventListener('input', (e) => {
        // Validation de sécurité
        if ((e.target as HTMLInputElement).value === this.spaceName) {
          btnFinalHardDelete.disabled = false;
        } else {
          btnFinalHardDelete.disabled = true;
        }
      });

      btnFinalHardDelete.addEventListener('click', async (e) => {
        e.preventDefault();

        try {
          btnFinalHardDelete.innerHTML =
            '<span class="spinner-border spinner-border-sm"></span> Destruction en cours...';
          btnFinalHardDelete.classList.add('disabled');

          await fetchDELETE(
            router(ROUTES.AJX.SPACE.DELETE, { id: this.spaceId }),
          );

          // Redirection vers l'accueil après destruction
          window.location.href = '/app';
        } catch (error) {
          alert("Erreur critique lors de la suppression de l'espace.");
          btnFinalHardDelete.innerHTML = 'Je confirme la suppression';
          btnFinalHardDelete.classList.remove('disabled');
        }
      });
    }
  }
}
