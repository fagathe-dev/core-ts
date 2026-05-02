import { $, createElement } from '..';
import { FormDataType, FormType } from '../../types';
import {
  clearCheck,
  clearInput,
  clearSelect,
  clearTextarea,
  clearValidation,
  fillCheckboxes,
  fillRadio,
  fillTextarea,
  getCheckboxesValue,
  getInputValue,
  getRadioValue,
  getSelectValue,
  getTextareaValue,
  selectOption,
} from './field-actions';

class FormManager {
  form: HTMLFormElement;
  initialData: FormDataType;
  static FORM_FIELD_SELECTOR: string = 'input, select, textarea';
  static FEEDBACK_SELECTORS: string[] = [
    '.invalid-feedback',
    '.valid-feedback',
  ];
  static VALIDATION_SELECTORS: string[] = ['.is-valid', '.is-invalid'];

  constructor({ form, initialData }: FormType) {
    this.form = form;

    this.initialData = initialData as FormDataType;
    this.init();
  }

  getData() {
    const fields = $(
      FormManager.FORM_FIELD_SELECTOR,
      true,
      this.form,
    ) as NodeListOf<HTMLElement>;
    const data: FormDataType = {};

    for (const field of Array.from(fields)) {
      const { tagName, name } = field as HTMLInputElement;
      switch (tagName) {
        case 'INPUT': {
          const { type } = field as HTMLInputElement;
          if (Object.prototype.hasOwnProperty.call(data, name)) {
            continue;
          } else {
            if (type === 'checkbox') {
              const choices = getCheckboxesValue(
                $(
                  `input[name="${name}"]`,
                  true,
                  this.form,
                ) as NodeListOf<HTMLInputElement>,
              );
              data[name] = choices;
              continue;
            }

            if (type === 'radio') {
              const choice = getRadioValue(
                $(
                  `input[name="${name}"]`,
                  true,
                  this.form,
                ) as NodeListOf<HTMLInputElement>,
              );
              data[name] = choice;
              continue;
            }

            if (
              type === 'text' ||
              type === 'number' ||
              type === 'date' ||
              type === 'datetime' ||
              type === 'password' ||
              type === 'hidden'
            ) {
              data[name] = getInputValue(field as HTMLInputElement);
            }
          }

          break;
        }

        case 'SELECT':
          data[name] = getSelectValue(field as HTMLSelectElement);

          break;

        case 'TEXTAREA':
          data[name] = getTextareaValue(field as HTMLTextAreaElement);

          break;

        default:
          break;
      }
    }

    return data;
  }

  fillData(data: FormDataType) {
    const fields = this.form.querySelectorAll(FormManager.FORM_FIELD_SELECTOR);

    for (const field of Array.from(fields)) {
      const { tagName, name } = field as HTMLInputElement;
      if (Object.prototype.hasOwnProperty.call(data, name)) {
        let value = data[name];
        switch (tagName) {
          case 'INPUT': {
            const { type } = field as HTMLInputElement;
            if (type === 'checkbox') {
              value = Array.isArray(value)
                ? (value = value as string[])
                : [value];
              fillCheckboxes(name, value as string[]);
            }

            if (type === 'radio') {
              fillRadio(name, value as string);
            }

            if (
              type === 'text' ||
              type === 'number' ||
              type === 'date' ||
              type === 'datetime' ||
              type === 'password' ||
              type === 'hidden'
            ) {
              (field as HTMLInputElement).value = value as string;
            }

            break;
          }
          case 'SELECT':
            selectOption(
              field as HTMLSelectElement,
              value as string | string[],
            );
            break;
          case 'TEXTAREA':
            fillTextarea(field as HTMLTextAreaElement, value as string);
            break;
          default:
            break;
        }
      } else {
        continue;
      }
    }
  }

  validateData(violations: FormDataType) {
    const fields = this.form.querySelectorAll(FormManager.FORM_FIELD_SELECTOR);

    for (const field of Array.from(fields)) {
      const { tagName, name } = field as HTMLInputElement;
      const container =
        (field.closest('fieldset') as HTMLFieldSetElement) ||
        (field.closest('div') as HTMLDivElement);
      let error = container.querySelector('.invalid-feedback');

      if (Object.prototype.hasOwnProperty.call(violations, name)) {
        if (
          (tagName === 'INPUT' &&
            (field as HTMLInputElement).type === 'checkbox') ||
          (field as HTMLInputElement).type === 'radio'
        ) {
          const choices = this.form.querySelectorAll(
            `input[name="${name}"]`,
          ) as NodeListOf<HTMLInputElement>;
          choices.forEach((el: HTMLInputElement) => {
            el.classList.add('is-invalid');
          });
        } else {
          field.classList.add('is-invalid');
        }
        if (error === null) {
          error = createElement('small');
          error.innerHTML = violations[name] as string;
          error.classList.add('invalid-feedback');
          container.insertAdjacentElement('beforeend', error);
        }
      } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        if (error !== null) {
          error.remove();
        }
      }
    }
  }

  reset() {
    const fields = this.form.querySelectorAll(FormManager.FORM_FIELD_SELECTOR);

    FormManager.FEEDBACK_SELECTORS.forEach((selector: string) => {
      clearValidation(this.form, selector);
    });

    FormManager.VALIDATION_SELECTORS.forEach((selector: string) => {
      clearValidation(this.form, selector);
    });

    fields.forEach((field) => {
      const { tagName } = field;
      const container =
        (field.closest('fieldset') as HTMLFieldSetElement) ||
        (field.closest('div') as HTMLDivElement);

      if (tagName === 'INPUT') {
        const { type } = field as HTMLInputElement;
        if (type === 'checkbox' || type === 'radio') {
          clearCheck(field as HTMLInputElement);
        }
        if (
          type === 'text' ||
          type === 'number' ||
          type === 'date' ||
          type === 'datetime' ||
          type === 'password' ||
          type === 'hidden'
        ) {
          clearInput(field as HTMLInputElement);
        }
      }
      if (tagName === 'SELECT') {
        clearSelect(field as HTMLSelectElement);
      }
      if (tagName === 'TEXTAREA') {
        clearTextarea(field as HTMLTextAreaElement);
      }
    });
  }

  init() {
    this.form.addEventListener('reset', (e) => {
      e.preventDefault();
      this.reset();
    });

    if (this.initialData) {
      this.fillData(this.initialData);
    }
  }
}

export { FormManager };
