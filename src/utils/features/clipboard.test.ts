import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  copyToClipboard,
  isClipboardSupported,
  copyElementContent,
} from './clipboard';

describe('copyToClipboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('copie via navigator.clipboard quand disponible', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      writable: true,
    });

    const result = await copyToClipboard('test text');
    expect(result.success).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('test text');
  });

  it('retourne success false si la copie échoue', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('fail')) },
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      writable: true,
    });

    const result = await copyToClipboard('test text');
    expect(result.success).toBe(false);
    expect(result.error).toBe('fail');
  });
});

describe('copyElementContent', () => {
  it("retourne une erreur si l'élément n'existe pas", async () => {
    const result = await copyElementContent('non-existent-id');
    expect(result.success).toBe(false);
    expect(result.error).toContain('non-existent-id');
  });

  it("copie le contenu textuel d'un élément", async () => {
    const el = document.createElement('div');
    el.id = 'copy-target';
    el.textContent = 'Hello Copy';
    document.body.appendChild(el);

    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      writable: true,
    });

    const result = await copyElementContent('copy-target');
    expect(result.success).toBe(true);
    el.remove();
  });
});

describe('isClipboardSupported', () => {
  it('retourne un booléen', () => {
    const result = isClipboardSupported();
    expect(typeof result).toBe('boolean');
  });
});
