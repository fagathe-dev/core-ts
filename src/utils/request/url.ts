import { BASE_URL } from '@/constants';
import { RouteParams } from '@/types/index.d';

/**
 * Tente de créer un objet URL à partir d'une chaîne.
 * Si l'URL est relative, une base de données factice est utilisée
 * pour permettre l'utilisation des fonctionnalités de l'objet URL.
 *
 * @param urlString L'URL à traiter (peut être absolue ou relative).
 * @returns L'objet URL ou null en cas d'erreur.
 */
const safeCreateUrl = (
  urlString: string,
  baseUrl: string = BASE_URL
): URL | null => {
  try {
    if (urlString.startsWith('http')) {
      return new URL(urlString);
    }
    // Utilise la base temporaire.
    return new URL(urlString, baseUrl);
  } catch (e) {
    console.error('Unable to create a safe URL', e);
    return null;
  }
};

/**
 * Ajoute ou met à jour des paramètres de requête dans une URL donnée.
 * * @param url L'URL initiale (ex: /posts?limit=10 ou https://example.com/data).
 * @param params Objet des paramètres à ajouter ou mettre à jour.
 * @returns L'URL modifiée sous forme de chaîne.
 */
const addQueryParams = (
  url: string,
  params: RouteParams,
  baseUrl: string = BASE_URL
): string => {
  const isAbsolute = url.startsWith('http');
  const urlObject = safeCreateUrl(url, baseUrl);

  if (!urlObject) {
    return url; // Retourne l'URL non modifiée si elle est invalide
  }

  // Accède directement à l'objet URLSearchParams
  const searchParams = urlObject.searchParams;

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      // Utilise set() pour ajouter ou mettre à jour la clé/valeur
      searchParams.set(key, String(value));
    }
  }

  // 1. Reconstruit la partie chemin + query (inclut le délimiteur '?' ou '#')
  const resultUrl = urlObject.pathname + urlObject.search + urlObject.hash;

  // 2. Si l'URL était absolue à l'origine, préfixer avec l'origine.
  if (isAbsolute) {
    // La méthode toString() est plus propre, mais on doit s'assurer de ne pas prendre la base factice
    // Utilisation de .origin et .pathname pour garantir la reconstruction correcte.
    return urlObject.origin + resultUrl;
  }

  // Si elle était relative, on retourne la partie relative
  return resultUrl;
};

/**
 * Supprime un ou plusieurs paramètres de requête d'une URL donnée.
 * * @param url L'URL initiale.
 * @param keys Un tableau de chaînes représentant les clés de paramètres à supprimer.
 * @returns L'URL modifiée sous forme de chaîne.
 */
const removeQueryParams = (
  url: string,
  keys: string[],
  baseUrl: string = BASE_URL
): string => {
  const isAbsolute = url.startsWith('http');
  const urlObject = safeCreateUrl(url, baseUrl);

  if (!urlObject) {
    return url; // Retourne l'URL non modifiée si elle est invalide
  }

  const searchParams = urlObject.searchParams;

  keys.forEach(key => {
    // remove() supprime le paramètre s'il existe
    searchParams.delete(key);
  });

  // 1. Reconstruit la partie chemin + query (inclut le délimiteur '?' ou '#')
  const resultUrl = urlObject.pathname + urlObject.search + urlObject.hash;

  // 2. Si l'URL était absolue à l'origine, préfixer avec l'origine.
  if (isAbsolute) {
    return urlObject.origin + resultUrl;
  }

  // Si elle était relative, on retourne la partie relative
  return resultUrl;
};

/**
 * Extrait tous les paramètres de requête (query string) d'une URL et les retourne
 * sous forme d'un objet clé-valeur.
 * NOTE : Si un paramètre est présent plusieurs fois (ex: ?tag=a&tag=b), seule la première
 * valeur sera conservée dans l'objet résultant.
 *
 * @param url L'URL à analyser.
 * @returns Un objet Record<string, string> contenant les paramètres.
 */
const getQueryParams = (
  url: string,
  baseUrl: string = BASE_URL
): Record<string, string> => {
  const urlObject = safeCreateUrl(url, baseUrl);

  if (!urlObject) {
    return {}; // Retourne un objet vide si l'URL est invalide
  }

  const params: Record<string, string> = {};

  // URLSearchParams.forEach est plus propre que d'itérer manuellement
  // forEach(value, key)
  urlObject.searchParams.forEach((value, key) => {
    // Si la clé n'existe pas déjà, on l'ajoute. (Pour gérer les multiples valeurs, il faudrait un tableau)
    if (!Object.prototype.hasOwnProperty.call(params, key)) {
      params[key] = value;
    }
  });

  return params;
};

const getCurrentUrl = (): string => {
  return window.location.href;
};

const getCurrentPath = (): string => {
  return window.location.pathname;
};

export {
  addQueryParams,
  removeQueryParams,
  getQueryParams,
  getCurrentUrl,
  getCurrentPath,
};
