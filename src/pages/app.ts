// file : `public/assets/ts/pages/app.ts`

import { $ } from '@/utils';
import {
  SidebarListManager,
  ThemeManager,
  SpaceViewManager,
  TrashManager,
  GlobalContentManager,
} from '@/managers';
import { SpaceManager } from '../managers/space/space.manager';

/**
 * Point d'entrée principal (Bundle esbuild)
 * Instancie les managers globaux.
 */
document.addEventListener('DOMContentLoaded', () => {
  // ---- Sidebar (SSR + injection dynamique) ----
  const spacesContainer = $('#sidebar-spaces', false) as HTMLElement | null;
  const capsulesContainer = $('#sidebar-capsules', false) as HTMLElement | null;
  const spaceForm = $('#formCreateSpace', false) as HTMLFormElement | null;

  if (spacesContainer && capsulesContainer && spaceForm) {
    new SidebarListManager(spacesContainer, capsulesContainer, spaceForm);
  }

  // ---- Theme ----
  new ThemeManager();

  // ---- Space Manager (suppression, modale) ----
  new SpaceManager();

  // ---- Space View (page app_space_show) ----
  const spaceContextEl = $(
    '#space-interactive-root',
    false,
  ) as HTMLElement | null;
  if (spaceContextEl) {
    new SpaceViewManager(spaceContextEl);
  }

  // ---- Corbeille (page trash) ----
  const trashContainer = $('#trash-container', false) as HTMLElement | null;
  if (trashContainer) {
    new TrashManager(trashContainer);
  }

  // ---- Archives & Corbeille SSR (pages globales) ----
  const globalArchivesRoot = $(
    '#global-archives-root',
    false,
  ) as HTMLElement | null;
  if (globalArchivesRoot) {
    new GlobalContentManager(globalArchivesRoot);
  }

  const globalTrashRoot = $('#global-trash-root', false) as HTMLElement | null;
  if (globalTrashRoot) {
    new GlobalContentManager(globalTrashRoot);
  }
});
