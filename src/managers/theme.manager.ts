/**
 * Gestionnaire de Thème (Light / Dark / Auto)
 * Responsabilité : Appliquer le thème, gérer le localStorage ET synchroniser avec la BDD.
 */

import { fetchPOST } from '@/utils/request/fetch';
import { ROUTES } from '@/constants';

type ThemeMode = 'light' | 'dark' | 'auto';

export class ThemeManager {
  private readonly STORAGE_KEY = 'superapp_theme_preference';
  private currentMode: ThemeMode = 'auto';

  constructor() {
    this.init();
  }

  private init(): void {
    const storedTheme = localStorage.getItem(
      this.STORAGE_KEY,
    ) as ThemeMode | null;
    if (
      storedTheme === 'light' ||
      storedTheme === 'dark' ||
      storedTheme === 'auto'
    ) {
      this.currentMode = storedTheme;
    }

    this.applyTheme(this.currentMode);
    this.setupDropdownListeners();

    // Écouter les changements de préférence système
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.currentMode === 'auto') {
          this.applyTheme('auto');
        }
      });
  }

  private applyTheme(mode: ThemeMode): void {
    let actualThemeToApply: string = mode;
    if (mode === 'auto') {
      actualThemeToApply = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
    }

    document.documentElement.dataset.mdbTheme = actualThemeToApply;
    this.updateDropdownUI(mode);
  }

  public async setTheme(mode: ThemeMode): Promise<void> {
    this.currentMode = mode;

    // 1. Sauvegarde locale (immédiate pour la réactivité et le FOUC)
    if (mode === 'auto') {
      localStorage.removeItem(this.STORAGE_KEY);
    } else {
      localStorage.setItem(this.STORAGE_KEY, mode);
    }

    this.applyTheme(mode);

    // 2. Synchronisation BDD en arrière-plan (Fire and Forget)
    try {
      await fetchPOST(ROUTES.AJX.USER_PREFERENCE.SET, {
        key: 'ui.theme_mode',
        value: mode,
      });
    } catch (e) {
      console.warn('Impossible de synchroniser le thème avec le serveur.', e);
      // On ne bloque pas l'UI, le localStorage a déjà fait le travail pour l'appareil actuel
    }
  }

  private setupDropdownListeners(): void {
    const switchers = document.querySelectorAll('.theme-switcher');
    switchers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const mode = btn.getAttribute('data-theme-value') as ThemeMode;
        if (mode) {
          this.setTheme(mode);
        }
      });
    });
  }

  private updateDropdownUI(activeMode: ThemeMode): void {
    const activeIconEl = document.getElementById('theme-icon-active');
    if (activeIconEl) {
      activeIconEl.className = '';
      if (activeMode === 'light')
        activeIconEl.className = 'fas fa-sun fa-lg text-warning';
      else if (activeMode === 'dark')
        activeIconEl.className = 'fas fa-moon fa-lg text-secondary';
      else
        activeIconEl.className = 'fas fa-circle-half-stroke fa-lg text-primary';
    }

    const switchers = document.querySelectorAll('.theme-switcher');
    switchers.forEach((btn) => {
      const checkIcon = btn.querySelector('.theme-check-icon');
      if (btn.getAttribute('data-theme-value') === activeMode) {
        btn.classList.add('fw-bold');
        checkIcon?.classList.remove('d-none');
      } else {
        btn.classList.remove('fw-bold');
        checkIcon?.classList.add('d-none');
      }
    });
  }
}
