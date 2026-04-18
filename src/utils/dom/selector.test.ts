import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { $ } from './selector';

describe('$', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('retourne un seul élément quand un seul match', () => {
    container.innerHTML = '<p class="unique">Unique</p>';
    const result = $('#test-container .unique');
    expect(result).toBeInstanceOf(HTMLElement);
    expect((result as HTMLElement).textContent).toBe('Unique');
  });

  it('retourne une NodeList quand plusieurs matchs', () => {
    container.innerHTML = '<p class="item">A</p><p class="item">B</p>';
    const result = $('#test-container .item');
    expect(result).toBeInstanceOf(NodeList);
    expect((result as NodeList).length).toBe(2);
  });

  it('retourne null quand aucun match', () => {
    const result = $('#test-container .non-existent');
    expect(result).toBeNull();
  });

  it('force la liste avec asList=true même pour un seul élément', () => {
    container.innerHTML = '<p class="solo">Solo</p>';
    const result = $('#test-container .solo', true);
    expect(result).toBeInstanceOf(NodeList);
  });

  it('limite la recherche à un parent donné', () => {
    container.innerHTML = '<span class="scoped">Inside</span>';
    document.body.insertAdjacentHTML('beforeend', '<span class="scoped">Outside</span>');
    const result = $<HTMLSpanElement>('.scoped', false, container);
    expect(result).toBeInstanceOf(HTMLElement);
    expect((result as HTMLElement).textContent).toBe('Inside');
    document.body.querySelector('span.scoped:not(#test-container span.scoped)')?.remove();
  });

  it('retourne une NodeList vide avec asList=true et aucun match', () => {
    const result = $('#test-container .nothing', true);
    expect(result).toBeInstanceOf(NodeList);
    expect((result as NodeList).length).toBe(0);
  });
});
