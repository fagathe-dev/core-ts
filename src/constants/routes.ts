const BASE_URL = window.location.origin;

const AJX_PREFIX = '/ajax';
const APP_PREFIX = '/app';

const ROUTES = {
  AJX: {
    SPACE: {
      CREATE: `${AJX_PREFIX}/space/create`,
      UPDATE: `${AJX_PREFIX}/space/{id}/edit`, // `id` de la space
      DELETE: `${AJX_PREFIX}/space/{id}/delete`, // `id` de la space
      LIST: `${AJX_PREFIX}/space`,
    },
    CAPSULE: {
      VERIFY: `${AJX_PREFIX}/space/capsule/{id}/verify`,
    },
    TODO: {
      LIST: `${AJX_PREFIX}/space/{id}/todo`, // `id` de la space, tous les todos de la liste
      CREATE: `${AJX_PREFIX}/space/{id}/todo`, // `id` de la space
      UPDATE: `${AJX_PREFIX}/todo/{id}`, // `id` de la todo
      DELETE: `${AJX_PREFIX}/todo/{id}`, // `id` de la todo
    },
    USER_PREFERENCE: {
      SET: `${AJX_PREFIX}/user/preferences`, // POST - Créer/Mettre à jour une préférence
    },
    FOLDER: {
      LIST: `${AJX_PREFIX}/space/{id}/folder`, // `id` de la space
      CREATE: `${AJX_PREFIX}/space/{id}/folder`,
      UPDATE: `${AJX_PREFIX}/folder/{id}`, // `id` du dossier
      DELETE: `${AJX_PREFIX}/folder/{id}`,
    },
    FILE: {
      LIST: `${AJX_PREFIX}/space/{id}/file`, // `id` de la space
      UPDATE: `${AJX_PREFIX}/file/{id}`, // `id` du fichier
      DELETE: `${AJX_PREFIX}/file/{id}`,
    },
    NOTE: {
      LIST: `${AJX_PREFIX}/space/{id}/note`, // `id` de la space
      CREATE: `${AJX_PREFIX}/space/{id}/note`,
      UPDATE: `${AJX_PREFIX}/note/{id}`, // `id` de la note
      DELETE: `${AJX_PREFIX}/note/{id}`,
    },
    MOVE: {
      ITEM: `${AJX_PREFIX}/move/{type}/{id}`, // PATCH - Déplacer un élément
      DESTINATIONS: `${AJX_PREFIX}/move/destinations`, // GET - Liste des espaces
      FOLDERS: `${AJX_PREFIX}/move/space/{id}/folders`, // GET - Dossiers d'un espace
    },
    TRASH: {
      LIST: `${AJX_PREFIX}/trash`,
      RESTORE: `${AJX_PREFIX}/trash/{type}/{id}/restore`, // PATCH
      HARD_DELETE: `${AJX_PREFIX}/trash/{type}/{id}`, // DELETE
      EMPTY: `${AJX_PREFIX}/trash/empty`, // DELETE — Vider la corbeille
    },
    ARCHIVE: {
      RESTORE: `${AJX_PREFIX}/archive/{type}/{id}/restore`, // PATCH
    },
  },
  APP: {},
};

export { BASE_URL, ROUTES };
