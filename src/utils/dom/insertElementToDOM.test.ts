import { describe, it, expect } from 'vitest';
import { insertElementToDOM } from './insertElementToDOM';

describe('insertElementToDOM', () => {
  it('insère un HTMLElement dans le body par défaut', () => {
    const el = document.createElement('div');
    el.id = 'test-insert';
    insertElementToDOM(el, null, null);
    expect(document.getElementById('test-insert')).toBeTruthy();
    el.remove();
  });

  it('insère une chaîne HTML dans le body', () => {
    insertElementToDOM('<span id="test-html-insert">Hello</span>', null, null);
    const found = document.getElementById('test-html-insert');
    expect(found).toBeTruthy();
    expect(found?.textContent).toBe('Hello');
    found?.remove();
  });

  it('insère dans un parent personnalisé', () => {
    const parent = document.createElement('div');
    document.body.appendChild(parent);
    const el = document.createElement('span');
    insertElementToDOM(el, 'beforeend', parent);
    expect(parent.children.length).toBe(1);
    parent.remove();
  });

  it('respecte la position "afterbegin"', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<p>existing</p>';
    document.body.appendChild(parent);
    const el = document.createElement('span');
    el.id = 'first-child';
    insertElementToDOM(el, 'afterbegin', parent);
    expect(parent.firstElementChild?.id).toBe('first-child');
    parent.remove();
  });

  it('utilise "beforeend" par défaut si position est null', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<p>first</p>';
    document.body.appendChild(parent);
    const el = document.createElement('span');
    el.id = 'last-child';
    insertElementToDOM(el, null, parent);
    expect(parent.lastElementChild?.id).toBe('last-child');
    parent.remove();
  });
});
