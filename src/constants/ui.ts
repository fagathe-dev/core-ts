// Constantes pour les animations et transitions
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 350,
} as const;

// Constantes pour les sélecteurs CSS
export const SELECTORS = {
  NAVBAR_TOGGLER: 'button.navbar-toggler',
  NAVBAR_COLLAPSE: '.navbar-collapse',
  NAVBAR_EXPAND: '[class*="navbar-expand-"]',
  APP_SIDEBAR_SELECTOR: '#sidebar',
  APP_SIDEBAR_LINKS_SELECTOR: '.nav-link',
  APP_SIDEBAR_ACTIVE_CLASS: 'active',
  APP_SIDEBAR_ATTRIBUTE: 'aria-current',
  PROFILE_DROPDOWN_TOGGLE: '[data-ds-target="#profileDropdownMenu"]',
  PROFILE_DROPDOWN_MENU: '#profileDropdownMenu',
  TOGGLE_ELEMENTS: '[data-ds-toggle]',
  DISMISS_ELEMENTS: '[data-ds-dismiss]',
  SELECTABLE_CARD_GROUPS: '.form-selectable-card',
  SELECTABLE_CARD_INPUTS: '.form-selectable-card-input',
} as const;

// Sélecteurs CSS
export const ALERT_SELECTOR = '.alert';
export const CLOSE_BUTTON_SELECTOR = '[data-ds-dismiss="alert"]';

// Durée par défaut de l'affichage d'une alerte non dismissible (3 secondes)
export const DEFAULT_DURATION = 10000;
