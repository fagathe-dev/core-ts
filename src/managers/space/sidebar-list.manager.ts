/**
 * SidebarListManager
 *
 * Gère la sidebar :
 * - Chargement dynamique de la liste des espaces/capsules via l'API
 * - Rendu HTML des éléments dans les conteneurs #sidebar-spaces / #sidebar-capsules
 * - Soumission du formulaire de création rapide (modale) avec ajout optimiste
 */

import { ROUTES } from '@/constants/routes';
import { fetchGET } from '@/utils/request/fetch';
import { FormManager } from '@/utils/forms/FormManager';
import { SpaceService } from '@/services/space.service';
import type { Space } from '@/types/index.d';

declare const mdb: any;

const APP_SPACE_PREFIX = '/app/space';
const EMPTY_MSG_SPACES = 'Aucun espace';
const EMPTY_MSG_CAPSULES = 'Aucune capsule';

export class SidebarListManager {
  private spacesContainer: HTMLElement;
  private capsulesContainer: HTMLElement;
  private form: HTMLFormElement;
  private formManager: FormManager;

  constructor(
    spacesContainer: HTMLElement,
    capsulesContainer: HTMLElement,
    form: HTMLFormElement,
  ) {
    this.spacesContainer = spacesContainer;
    this.capsulesContainer = capsulesContainer;
    this.form = form;
    this.formManager = new FormManager({ form: this.form });

    this.init();
  }

  private init(): void {
    this.bindFormSubmit();
  }

  /**
   * Charge dynamiquement la liste des espaces/capsules depuis l'API
   * et remplace le contenu SSR de la sidebar.
   */
  async loadSpaces(): Promise<void> {
    try {
      const response = await fetchGET<Space[]>(ROUTES.AJX.SPACE.LIST);
      const allSpaces = response.data;

      const spaces = allSpaces.filter(
        (s) => !s.isCapsule && s.state !== 'trash',
      );
      const capsules = allSpaces.filter(
        (s) => s.isCapsule && s.state !== 'trash',
      );

      this.renderList(this.spacesContainer, spaces, EMPTY_MSG_SPACES, false);
      this.renderList(
        this.capsulesContainer,
        capsules,
        EMPTY_MSG_CAPSULES,
        true,
      );
    } catch (error) {
      console.error(
        '[SidebarListManager] Erreur lors du chargement des espaces',
        error,
      );
    }
  }

  /**
   * Génère le HTML d'un élément nav-link pour le sidebar
   */
  private createSpaceLink(space: Space, isCapsule: boolean): HTMLAnchorElement {
    const slug = space.slug || 'espace';
    const url = `${APP_SPACE_PREFIX}/${slug}-${space.id}`;
    const isActive = window.location.pathname === url;
    const defaultColor = isCapsule ? 'danger' : 'primary';
    const defaultIcon = isCapsule ? 'fas fa-lock' : 'fas fa-cube';
    const color = space.color || defaultColor;
    const icon = space.icon || defaultIcon;

    const a = document.createElement('a');
    a.href = url;
    a.className = `nav-link text-body d-flex align-items-center rounded-3 px-2 py-1${isActive ? ' active fw-bold bg-light shadow-sm' : ''}`;
    if (isActive) a.setAttribute('aria-current', 'page');
    a.setAttribute('data-mdb-ripple-init', '');

    const iconDiv = document.createElement('div');
    iconDiv.className =
      'rounded p-1 me-2 d-flex align-items-center justify-content-center';
    iconDiv.style.cssText = `width: 28px; height: 28px; background-color: var(--mdb-${color}-bg-subtle); color: var(--mdb-${color}-text-emphasis);`;

    const i = document.createElement('i');
    i.className = `${icon} fa-fw fa-sm`;
    iconDiv.appendChild(i);

    const span = document.createElement('span');
    span.className = 'fw-medium text-truncate';
    span.textContent = space.name;

    a.appendChild(iconDiv);
    a.appendChild(span);

    if (!isCapsule && space.is_collaborative) {
      const collabIcon = document.createElement('i');
      collabIcon.className = 'fas fa-users text-muted small';
      a.appendChild(document.createTextNode('\u00A0'));
      a.appendChild(collabIcon);
    }

    return a;
  }

  /**
   * Effectue le rendu d'une liste d'espaces dans un conteneur nav
   */
  private renderList(
    container: HTMLElement,
    spaces: Space[],
    emptyMessage: string,
    isCapsule: boolean,
  ): void {
    container.innerHTML = '';

    if (spaces.length === 0) {
      const p = document.createElement('p');
      p.className = 'text-muted text-center py-2 small sidebar-empty-msg';
      p.textContent = emptyMessage;
      container.appendChild(p);
      return;
    }

    for (const space of spaces) {
      container.appendChild(this.createSpaceLink(space, isCapsule));
    }
  }

  /**
   * Gère la soumission du formulaire de création d'espace (modale globale).
   * En cas de succès, ajoute l'espace de manière optimiste dans la sidebar.
   */
  private bindFormSubmit(): void {
    this.form.addEventListener('submit', async (e: Event) => {
      e.preventDefault();

      const submitBtn = this.form.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement | null;
      const originalText = submitBtn?.innerHTML ?? '';

      try {
        if (submitBtn) {
          submitBtn.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2"></span>Création...';
          submitBtn.disabled = true;
        }

        const data = this.formManager.getData();
        const payload: Partial<Space> = {
          name: data.name as string,
          description: (data.description as string) || null,
          color: Array.isArray(data.color)
            ? data.color[0]
            : (data.color as string),
          icon: Array.isArray(data.icon) ? data.icon[0] : (data.icon as string),
          isCapsule: data.isCapsule === 'true' || data.isCapsule === true,
        };

        const newSpace = await SpaceService.create(payload);

        // Ajout optimiste dans la bonne section
        this.addSpaceToSidebar(newSpace);

        // Fermeture de la modale
        this.closeModal();

        // Reset du formulaire
        this.formManager.reset();
      } catch (error) {
        console.error('[SidebarListManager] Erreur de création', error);
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  }

  /**
   * Ajoute un nouvel espace dans la section appropriée de la sidebar
   */
  private addSpaceToSidebar(space: Space): void {
    const isCapsule = space.isCapsule;
    const container = isCapsule ? this.capsulesContainer : this.spacesContainer;

    // Supprimer le message "Aucun espace" s'il existe
    const emptyMsg = container.querySelector('.sidebar-empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const link = this.createSpaceLink(space, isCapsule);
    container.appendChild(link);
  }

  /**
   * Ferme la modale de création MDB
   */
  private closeModal(): void {
    const modalEl = document.getElementById('spaceCreationModal');
    if (modalEl) {
      const instance = mdb.Modal.getInstance(modalEl);
      if (instance) instance.hide();
    }
  }
}
