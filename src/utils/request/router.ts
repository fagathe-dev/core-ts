/**
 * Interface pour les paramètres de route, supportant des valeurs simples.
 */
interface RouteParams extends Record<string, string | number | boolean> {}

/**
 * Génère une URL basée sur un chemin de base, en gérant le remplacement des paramètres
 * de chemin et l'ajout de paramètres de requête.
 *
 * Cette version utilise l'objet URL pour une gestion robuste des paramètres de requête.
 *
 * @param path Le chemin de la route, potentiellement avec des paramètres entre accolades (ex: /lists/{listId}/update).
 * @param params Un objet contenant les paramètres à appliquer. Les paramètres correspondants dans le chemin sont remplacés, les autres sont ajoutés en query string.
 * @param absoluteUrl Si true, préfixe l'URL avec l'origine de la fenêtre (window.location.origin).
 * @returns L'URL générée sous forme de chaîne.
 */
const router = (
  path: string,
  params: RouteParams = {},
  absoluteUrl: boolean = false,
): string => {
  // 1. Remplacement des paramètres de chemin ({parametre})
  const remainingParams: RouteParams = { ...params };
  let finalPath = path;

  // Regex pour trouver toutes les occurrences de {nom_du_parametre}
  finalPath = finalPath.replace(/{(\w+)}/g, (match, paramName) => {
    // Vérifie si le paramètre est fourni dans l'objet params
    if (Object.prototype.hasOwnProperty.call(remainingParams, paramName)) {
      const value = remainingParams[paramName];

      // Supprime le paramètre utilisé
      delete remainingParams[paramName];

      // Retourne la valeur pour remplacer la balise {paramName}
      return String(value);
    }

    // Si le paramètre n'est pas trouvé, on le supprime du chemin
    return '';
  });

  // Nettoyer les doubles slashes qui pourraient être introduits
  finalPath = finalPath.replace(/\/{2,}/g, '/');

  // 2. Construction de la Query String à partir des paramètres restants en utilisant URLSearchParams
  const searchParams = new URLSearchParams();

  for (const key in remainingParams) {
    if (Object.prototype.hasOwnProperty.call(remainingParams, key)) {
      const value = remainingParams[key];
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();

  // 3. Assemblage de l'URL finale
  let baseUrl = finalPath;

  if (queryString) {
    // Ajoute la query string en s'assurant qu'il y a un délimiteur approprié
    baseUrl += (baseUrl.includes('?') ? '&' : '?') + queryString;
  }

  if (absoluteUrl && typeof window !== 'undefined' && window.location.origin) {
    // L'objet URL gère proprement l'assemblage Base + Path
    try {
      // Créer une URL complète : 'http://domain.com' + '/path/to/resource?query=string'
      // Le "baseUrl" relatif doit être sans le slash initial pour fonctionner parfaitement avec l'origine.
      const url = new URL(
        baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`,
        window.location.origin,
      );

      // On retourne l'URL complète
      return url.href;
    } catch (error) {
      // Retourne l'URL relative en cas d'erreur de construction de l'objet URL
      return baseUrl;
    }
  }

  return baseUrl;
};

export { router };
