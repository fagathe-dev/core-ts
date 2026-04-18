import { $ } from '@/utils';

/**
 * Clears the value of a textarea element and triggers the 'input' event.
 *
 * @param {HTMLTextAreaElement} textarea
 */
export const clearTextarea = (textarea: HTMLTextAreaElement): void => {
  textarea.value = '';
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
};

/**
 * Clears the input[type]
 *
 * @param {HTMLInputElement} check
 */
export const clearCheck = (input: HTMLInputElement): void => {
  input.checked = false;
  // Déclenche l'événement pour chaque input modifié
  const event = new Event('input', { bubbles: true });
  input.dispatchEvent(event);
};

/**
 * Clears the value of an input element and triggers the 'input' event.
 *
 * @param {HTMLInputElement} input
 */
export const clearInput = (input: HTMLInputElement): void => {
  if (input.type === 'checkbox' || input.type === 'radio') {
    input.checked = false;
  } else {
    input.value = '';
  }
  const event = new Event('input', { bubbles: true });
  input.dispatchEvent(event);
};

/**
 * Clears all selected options in a select element and triggers the 'change' event.
 *
 * @param {HTMLSelectElement} select
 */
export const clearSelect = (select: HTMLSelectElement): void => {
  Array.from(select.options).forEach((option) => {
    option.selected = false;
  });

  const event = new Event('change', { bubbles: true });
  select.dispatchEvent(event);
};

/**
 * Remove all feedback element from HTMLFormElement
 *
 * @param {HTMLFormElement} form
 * @param {string} feedbackClass
 */
export const clearFeedback = (
  form: HTMLFormElement,
  feedbackClass: string,
): void => {
  const feedbackElements = $(
    `.${feedbackClass}`,
    true,
    form,
  ) as NodeListOf<HTMLElement>;

  feedbackElements.forEach((element: HTMLElement) => {
    element.remove();
  });
};

/**
 * Remove validation classes from all form fields in the given form.
 *
 * @param {HTMLFormElement} form - The form element to clear validation classes from.
 */
export const clearValidation = (
  form: HTMLFormElement,
  validationClass: string,
): void => {
  const fields = $(validationClass, true, form) as NodeListOf<HTMLElement>;

  fields.forEach((field: HTMLElement) => {
    field.classList.remove(validationClass);
  });
};
