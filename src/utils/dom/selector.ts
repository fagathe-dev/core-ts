/**
 * Un type générique pour représenter une liste d'éléments HTML.
 * Il peut être un seul élément ou un tableau d'éléments.
 * @template T Le type de l'élément HTML (par défaut, HTMLElement).
 */
type ElementOrList<T extends HTMLElement> = T | NodeListOf<T>;

/**
 * Une version simplifiée du sélecteur jQuery.
 *
 * Si le sélecteur correspond à plusieurs éléments, un NodeListOf est retourné.
 * S'il correspond à un seul élément, l'élément lui-même est retourné.
 * Si aucun élément ne correspond, null est retourné.
 *
 * @param selector Le sélecteur CSS de l'élément à trouver.
 * @param asList Indique si le résultat doit être une liste même s'il n'y a qu'un seul élément.
 * @param parent L'élément parent dans lequel la recherche doit être effectuée (facultatif).
 * @returns Un seul élément, une liste d'éléments ou null.
 */
const $ = <T extends HTMLElement>(
  selector: string,
  asList: boolean = false,
  parent: Document | HTMLElement = document
): ElementOrList<T> | null => {
  const elements = parent.querySelectorAll<T>(selector);

  if (elements.length === 1 && !asList) {
    // Si un seul élément est trouvé, on le retourne directement pour simplifier l'accès.
    return elements[0];
  }

  if (elements.length > 1 || asList) {
    // Si plusieurs éléments sont trouvés, on retourne la liste complète.
    return elements;
  }

  // Si aucun élément n'est trouvé.
  return null;
}

export { $ };