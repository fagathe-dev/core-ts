import { describe, it, expect } from 'vitest';
import {
  getCheckboxesValue,
  getRadioValue,
  getInputValue,
  getSelectValue,
  getTextareaValue,
} from './get';

describe('getCheckboxesValue', () => {
  it('retourne les valeurs des checkboxes cochées', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <input type="checkbox" name="cb" value="a" checked>
      <input type="checkbox" name="cb" value="b">
      <input type="checkbox" name="cb" value="c" checked>
    `;
    document.body.appendChild(container);
    const checkboxes = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    const result = getCheckboxesValue(checkboxes);
    expect(result).toEqual(['a', 'c']);
    container.remove();
  });

  it('retourne null si aucune checkbox cochée', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <input type="checkbox" name="cb" value="a">
      <input type="checkbox" name="cb" value="b">
    `;
    document.body.appendChild(container);
    const checkboxes = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(getCheckboxesValue(checkboxes)).toBeNull();
    container.remove();
  });
});

describe('getRadioValue', () => {
  it('retourne la valeur du radio sélectionné', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <input type="radio" name="r" value="x">
      <input type="radio" name="r" value="y" checked>
    `;
    document.body.appendChild(container);
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(getRadioValue(radios)).toBe('y');
    container.remove();
  });

  it('retourne null si aucun radio sélectionné', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <input type="radio" name="r" value="x">
      <input type="radio" name="r" value="y">
    `;
    document.body.appendChild(container);
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(getRadioValue(radios)).toBeNull();
    container.remove();
  });
});

describe('getInputValue', () => {
  it('retourne la valeur d\'un input text non vide', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = 'hello';
    expect(getInputValue(input)).toBe('hello');
  });

  it('retourne null pour un input text vide', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = '';
    expect(getInputValue(input)).toBeNull();
  });

  it('retourne null pour un type non supporté', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.value = '';
    expect(getInputValue(input)).toBeNull();
  });

  it('retourne la valeur d\'un input number', () => {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = '42';
    expect(getInputValue(input)).toBe('42');
  });

  it('retourne la valeur d\'un input hidden', () => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.value = 'secret';
    expect(getInputValue(input)).toBe('secret');
  });
});

describe('getSelectValue', () => {
  it('retourne la valeur sélectionnée d\'un select simple', () => {
    const select = document.createElement('select');
    select.innerHTML = `
      <option value="a">A</option>
      <option value="b" selected>B</option>
    `;
    expect(getSelectValue(select)).toBe('b');
  });

  it('retourne un tableau pour un select multiple', () => {
    const select = document.createElement('select');
    select.multiple = true;
    select.innerHTML = `
      <option value="a" selected>A</option>
      <option value="b">B</option>
      <option value="c" selected>C</option>
    `;
    expect(getSelectValue(select)).toEqual(['a', 'c']);
  });

  it('retourne null si aucune option sélectionnée', () => {
    const select = document.createElement('select');
    select.multiple = true;
    select.innerHTML = `
      <option value="a">A</option>
      <option value="b">B</option>
    `;
    // Désélectionner tout
    Array.from(select.options).forEach(o => (o.selected = false));
    expect(getSelectValue(select)).toBeNull();
  });
});

describe('getTextareaValue', () => {
  it('retourne la valeur d\'un textarea non vide', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'contenu';
    expect(getTextareaValue(textarea)).toBe('contenu');
  });

  it('retourne null pour un textarea vide', () => {
    const textarea = document.createElement('textarea');
    textarea.value = '';
    expect(getTextareaValue(textarea)).toBeNull();
  });
});
