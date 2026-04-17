const APP_WORKSPACE_DATA_SESSION_KEY = '__ffr_v.wsp.app_data';
const API_TOKEN_COOKIE_NAME = '__ffr_v.aoth.tkn';

// 3. On réexporte les données.
// Le "as readonly string[]" est une bonne pratique pour garantir l'immutabilité.
import WORKSPACE_ICONS_DATA from '@data/workspace-icons.json';
import WORKSPACE_COLORS_DATA from '@data/workspace-colors.json';

const WORKSPACE_ICONS = WORKSPACE_ICONS_DATA as readonly string[];
const WORKSPACE_COLORS = WORKSPACE_COLORS_DATA as readonly string[];

const APP_VIEW_CURRENT_CONTEXT = 'app_cur_ctx';
const APP_VIEW_CURRENT_CONTEXT_DATA = 'apvw_cur_ctx';
const WORKSPACE_CURRENT_CONTEXT_DATA = 'wsk_cur_ctx';

// 4. (ASTUCE) On crée un type basé sur le tableau pour l'utiliser ailleurs
// ATTENTION : Avec un JSON, TypeScript va souvent inférer "string" générique
// au lieu de l'union précise "'archive' | 'bell' ...".

export {
  APP_WORKSPACE_DATA_SESSION_KEY,
  API_TOKEN_COOKIE_NAME,
  WORKSPACE_ICONS,
  WORKSPACE_COLORS,
  WORKSPACE_CURRENT_CONTEXT_DATA,
  APP_VIEW_CURRENT_CONTEXT_DATA,
  APP_VIEW_CURRENT_CONTEXT,
};
