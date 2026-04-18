import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DragNDrop } from './drag-n-drop';

// Polyfill pour JSDOM
if (typeof window.DragEvent === 'undefined') {
  global.DragEvent = class DragEvent extends Event {
    dataTransfer = { setData: vi.fn(), getData: vi.fn() };
    constructor(type: string, options?: EventInit) {
      super(type, options);
    }
  } as any;
}

describe('DragNDrop', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'drag-container';
    container.innerHTML = `
      <div class="file-row" draggable="true" data-id="1">File 1</div>
      <div class="file-row" draggable="true" data-id="2">File 2</div>
      <div class="folder-row" data-id="folder-1">Folder 1</div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('s\'initialise avec un sélecteur string', () => {
    const dnd = new DragNDrop({
      container: '#drag-container',
      itemSelector: '.file-row',
    });
    expect(dnd).toBeInstanceOf(DragNDrop);
  });

  it('s\'initialise avec un élément HTML', () => {
    const dnd = new DragNDrop({
      container,
      itemSelector: '.file-row',
    });
    expect(dnd).toBeInstanceOf(DragNDrop);
  });

  it('affiche un warning si le conteneur est introuvable', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    new DragNDrop({
      container: '#non-existent',
      itemSelector: '.file-row',
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Conteneur introuvable'),
      '#non-existent'
    );
    consoleSpy.mockRestore();
  });

  it('appelle onDragStart lors du dragstart sur un item valide', () => {
    const onDragStart = vi.fn();
    new DragNDrop({
      container,
      itemSelector: '.file-row',
      onDragStart,
    });

    const item = container.querySelector('.file-row') as HTMLElement;
    const event = new DragEvent('dragstart', { bubbles: true });
    Object.defineProperty(event, 'target', { value: item });
    // Mock matches pour jsdom
    item.matches = vi.fn().mockReturnValue(true);

    Object.defineProperty(event, 'dataTransfer', {
      value: {
        effectAllowed: '',
        setData: vi.fn(),
      },
    });

    item.dispatchEvent(event);
    expect(onDragStart).toHaveBeenCalled();
  });

  it('appelle onDrop lors du drop sur une cible valide', () => {
    const onDrop = vi.fn();
    new DragNDrop({
      container,
      itemSelector: '.file-row',
      dropTargetSelector: '.folder-row',
      onDrop,
    });

    const item = container.querySelector('.file-row') as HTMLElement;
    const folder = container.querySelector('.folder-row') as HTMLElement;

    // Simuler dragstart
    const dragStartEvt = new DragEvent('dragstart', { bubbles: true });
    Object.defineProperty(dragStartEvt, 'target', { value: item });
    item.matches = vi.fn().mockReturnValue(true);
    Object.defineProperty(dragStartEvt, 'dataTransfer', {
      value: { effectAllowed: '', setData: vi.fn() },
    });
    item.dispatchEvent(dragStartEvt);

    // Simuler drop sur le folder
    const dropEvt = new DragEvent('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(dropEvt, 'target', { value: folder });
    folder.closest = vi.fn().mockReturnValue(folder);
    folder.dispatchEvent(dropEvt);

    expect(onDrop).toHaveBeenCalled();
  });
});
