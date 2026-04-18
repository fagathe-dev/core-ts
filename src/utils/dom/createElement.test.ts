import { describe, it, expect } from 'vitest';
import { createElement } from './createElement';

describe('createElement', () => {
  it('crée un élément avec le bon tag', () => {
    const el = createElement('div');
    expect(el.tagName).toBe('DIV');
  });

  it('applique les classes CSS', () => {
    const el = createElement('span', 'foo bar');
    expect(el.className).toBe('foo bar');
  });

  it('applique un id', () => {
    const el = createElement('p', undefined, 'my-id');
    expect(el.id).toBe('my-id');
  });

  it('applique des attributs string', () => {
    const el = createElement('a', undefined, undefined, { href: '/test', title: 'Link' });
    expect(el.getAttribute('href')).toBe('/test');
    expect(el.getAttribute('title')).toBe('Link');
  });

  it('applique des attributs booléens true', () => {
    const el = createElement('input', undefined, undefined, { required: true, disabled: true });
    expect(el.hasAttribute('required')).toBe(true);
    expect(el.getAttribute('required')).toBe('');
  });

  it('ignore les attributs false, null, undefined', () => {
    const el = createElement('input', undefined, undefined, {
      disabled: false,
    });
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('convertit les nombres en chaîne', () => {
    const el = createElement('div', undefined, undefined, { 'data-count': 42 });
    expect(el.getAttribute('data-count')).toBe('42');
  });

  it('ne plante pas sans paramètres optionnels', () => {
    const el = createElement('div');
    expect(el.className).toBe('');
    expect(el.id).toBe('');
  });
});
