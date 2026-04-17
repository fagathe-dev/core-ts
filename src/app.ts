// file : `public/assets/ts/app.ts`
/**
 * Point d'entrée GLOBAL de l'application.
 * Ce script est chargé sur TOUTES les pages via layout.html.twig.
 * Il ne doit contenir que la logique transversale (Layout, Thème, Modale globale).
 */

import { $, SelectableField } from '@/utils';
import { SidebarListManager, SpaceManager, ThemeManager } from '@/managers';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialisation de l'interface globale (Layout)
  initResponsiveSidebar();

  // 2. Gestion du Thème (Clair/Sombre)
  new ThemeManager();

  // 3. Initialisation de la modale globale de création d'Espace
  initGlobalSpaceCreation();

  // Note : SpaceViewManager et l'ancien TodoListManager ont été retirés d'ici.
  // La logique spécifique à l'affichage d'un espace est désormais dans `pages/space_show.ts`.
});

/**
 * Gère le comportement "offcanvas" de la sidebar sur mobile
 */
function initResponsiveSidebar(): void {
  const sidebar = $('#appSidebar', false) as HTMLElement | null;
  const overlay = $('#sidebarOverlay', false) as HTMLElement | null;
  const toggleBtn = $('#sidebarToggle', false) as HTMLElement | null;

  const toggleSidebar = () => {
    if (sidebar && overlay) {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
    }
  };

  // Ouverture via hamburger
  if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
  // Fermeture via clic sur l'overlay
  if (overlay) overlay.addEventListener('click', toggleSidebar);
}

/**
 * Initialise la modale de création d'espace et ses composants UI.
 * Cette modale étant présente dans la sidebar, elle est accessible partout.
 */
function initGlobalSpaceCreation(): void {
  const spacesContainer = $('#sidebar-spaces', false) as HTMLElement | null;
  const capsulesContainer = $('#sidebar-capsules', false) as HTMLElement | null;
  const spaceForm = $('#formCreateSpace', false) as HTMLFormElement | null; // Assure-toi que l'ID matche ton Twig (_modal_create.html.twig)

  // 1. Initialisation du manager global de l'espace (pour les reset de modale et delete)
  new SpaceManager();

  // 2. Initialisation de la soumission de la création et de l'ajout optimiste dans la sidebar
  if (spacesContainer && capsulesContainer && spaceForm) {
    new SidebarListManager(spacesContainer, capsulesContainer, spaceForm);

    // 3. Initialisation des sélecteurs visuels de la modale de création
    const colorContainer = $(
      '#color-selector-container',
      false,
    ) as HTMLElement | null;
    const iconContainer = $(
      '#icon-selector-container',
      false,
    ) as HTMLElement | null;

    if (colorContainer) {
      new SelectableField(colorContainer, { mode: 'radio' });
    }
    if (iconContainer) {
      new SelectableField(iconContainer, { mode: 'radio' }); // Tu avais mis 'nullable', j'ai harmonisé selon ton TS précédent, à adapter si besoin.
    }
  }
}
