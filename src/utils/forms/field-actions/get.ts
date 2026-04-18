/**
 * Get value of checboxes
 *
 * @param {NodeListOf<HTMLInputElement>} checkboxes
 * @returns {(string[] | null)}
 */
export const getCheckboxesValue = (
  checkboxes: NodeListOf<HTMLInputElement>,
): string[] | null => {
  const values: string[] = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      values.push(checkbox.value);
    }
  });
  return values.length > 0 ? values : null;
};

/**
 * Get value of radio buttons
 *
 * @param {NodeListOf<HTMLInputElement>} radioButtons
 * @returns {(string | null)}
 */
export const getRadioValue = (
  radioButtons: NodeListOf<HTMLInputElement>,
): string | null => {
  for (const radio of radioButtons) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return null;
};

/**
 * Get value of input type text, number, date, datetime, password or hidden
 *
 * @param {HTMLInputElement} input
 * @returns {(string | null)}
 */
export const getInputValue = (input: HTMLInputElement): string | null => {
  const { type } = input;
  if (
    type === 'text' ||
    type === 'number' ||
    type === 'date' ||
    type === 'datetime' ||
    type === 'password' ||
    type === 'hidden'
  ) {
    return input.value !== '' ? input.value : null;
  }
  return null;
};

/**
 * Get value of select element
 *
 * @param {HTMLSelectElement} select
 * @returns {(string | string[] | null)}
 */
export const getSelectValue = (
  select: HTMLSelectElement,
): string | string[] | null => {
  const selectedOptions = Array.from(select.options).filter(
    (option: HTMLOptionElement) => option.selected,
  );

  if (selectedOptions.length === 0) {
    return null;
  }

  if (select.multiple) {
    return selectedOptions.map((option: HTMLOptionElement) => option.value);
  } else {
    return selectedOptions[0].value;
  }
};

export const getTextareaValue = (
  textarea: HTMLTextAreaElement,
): string | null => {
  return textarea.value !== '' ? textarea.value : null;
};
