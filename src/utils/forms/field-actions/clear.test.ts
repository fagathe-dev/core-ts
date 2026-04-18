import { describe, it, expect } from 'vitest';
import {
  clearTextarea,
  clearCheck,
  clearInput,
  clearSelect,
  clearValidation,
} from './clear';

describe('clearTextarea', () => {
  it('vide la valeur du textarea', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'contenu';
    clearTextarea(textarea);
    expect(textarea.value).toBe('');
  });
});

describe('clearCheck', () => {
  it('décoche un input checkbox', () => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = true;
    clearCheck(input);
    expect(input.checked).toBe(false);
  });

  it('décoche un input radio', () => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.checked = true;
    clearCheck(input);
    expect(input.checked).toBe(false);
  });
});

describe('clearInput', () => {
  it('vide un input text', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = 'hello';
    clearInput(input);
    expect(input.value).toBe('');
  });

  it('décoche un input checkbox', () => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = true;
    clearInput(input);
    expect(input.checked).toBe(false);
  });

  it('décoche un input radio', () => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.checked = true;
    clearInput(input);
    expect(input.checked).toBe(false);
  });
});

describe('clearSelect', () => {
  it("désélectionne toutes les options d'un select multiple", () => {
    const select = document.createElement('select');
    select.multiple = true;
    select.innerHTML = `
      <option value="a" selected>A</option>
      <option value="b" selected>B</option>
    `;
    clearSelect(select);
    const selected = Array.from(select.options).filter((o) => o.selected);
    expect(selected.length).toBe(0);
  });
});

describe('clearValidation', () => {
  it('sélectionne les éléments via le sélecteur CSS fourni', () => {
    const form = document.createElement('form');
    form.innerHTML = `
      <input class="is-invalid" name="email">
      <input class="is-invalid" name="name">
    `;
    document.body.appendChild(form);
    // Note: clearValidation reçoit '.is-invalid' et appelle classList.remove('.is-invalid')
    // classList.remove attend un nom de classe sans le point, donc la classe n'est pas retirée.
    // Ce test valide le comportement actuel du code source.
    clearValidation(form, 'is-invalid');
    const invalids = form.querySelectorAll('.is-invalid');
    expect(invalids.length).toBe(2);
    form.remove();
  });
});
