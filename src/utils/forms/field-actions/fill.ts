import { $ } from '@/utils/dom/selector';

/**
 * Remplit une zone de texte avec le texte fourni et déclenche l'événement 'input'.
 *
 * @param textarea L'élément HTMLTextAreaElement à remplir.
 * @param text Le texte à insérer dans la zone de texte.
 */
export const fillTextarea = (
  textarea: HTMLTextAreaElement,
  text: string,
): void => {
  textarea.value = text;
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
};

/**
 * Description placeholder
 *
 * @param {HTMLInputElement} input
 * @param {(string | number | boolean)} value
 */
export const fillInput = (
  input: HTMLInputElement,
  value: string | number | boolean,
): void => {
  const { type } = input;

  if (
    type === 'text' ||
    type === 'number' ||
    type === 'date' ||
    type === 'datetime' ||
    type === 'password' ||
    type === 'hidden'
  ) {
    input.value = String(value);
  }

  const event = new Event('input', { bubbles: true });
  input.dispatchEvent(event);
};

/**
 * Sélectionne un bouton radio spécifique dans un groupe par son nom et sa valeur.
 * Déclenche l'événement 'input' sur l'élément sélectionné pour simuler l'action utilisateur.
 *
 * @param name Le nom (attribut 'name') du groupe de boutons radio.
 * @param value La valeur (attribut 'value') du bouton radio à sélectionner.
 */
export const fillRadio = (
  name: string,
  value: string | number | boolean | null,
): void => {
  // Convertir la valeur cible en chaîne pour la comparaison avec input.value.
  const targetValue = String(value);

  // Sélectionner tous les boutons radio appartenant à ce groupe.
  const radioButtons: NodeListOf<HTMLInputElement> = document.querySelectorAll(
    `input[type="radio"][name="${name}"]`,
  );

  radioButtons.forEach((input) => {
    // Vérifier si la valeur du bouton correspond à la valeur cible
    if (input.value === targetValue) {
      input.checked = true;
      // Déclencher l'événement 'input' directement sur l'élément sélectionné
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
    if (value === null || value === false) {
      input.checked = false;
    } else {
      // Assurer que les autres boutons du groupe sont décochés
      input.checked = false;
    }
  });
};

/**
 * Sélectionne une ou plusieurs options dans un élément <select> en fonction de la valeur fournie.
 * Déclenche l'événement 'change' sur l'élément <select> pour simuler l'action utilisateur.
 *
 * @param select L'élément HTMLSelectElement dans lequel sélectionner les options.
 * @param value La valeur ou les valeurs des options à sélectionner. Peut être une chaîne ou un tableau de chaînes.
 */
export const selectOption = (
  select: HTMLSelectElement,
  value: string | string[],
): void => {
  const isMultiple = select.multiple;
  const values = Array.isArray(value) ? value : [value];

  Array.from(select.options).forEach((option) => {
    option.selected = values.includes(option.value);
  });

  const event = new Event('change', { bubbles: true });
  select.dispatchEvent(event);
};

export const fillCheckboxes = (name: string, values: string[]): void => {
  // Sélectionne toutes les checkboxes qui ont ce nom
  const checkboxes: NodeListOf<HTMLInputElement> = $(
    `input[type="checkbox"][name="${name}"]`,
    true,
  ) as NodeListOf<HTMLInputElement>;

  checkboxes.forEach((input) => {
    // Coche l'input si sa valeur est présente dans le tableau 'values'
    input.checked = values.includes(input.value);

    // Déclenche l'événement pour chaque input modifié
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  });
};
