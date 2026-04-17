/**
 * Configuration par défaut pour les requêtes
 */
const DEFAULT_FETCH_API_CONFIG = {
  timeout: 30000, // 30 secondes
  retries: 2, // Par défaut, on peut mettre 2 retries (total 3 tentatives)
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export { DEFAULT_FETCH_API_CONFIG };
