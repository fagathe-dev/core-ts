import { describe, it, expect } from 'vitest';
import { convertMarkdownToHtml } from './marked';

describe('convertMarkdownToHtml', () => {
  it('convertit un texte markdown simple en HTML', () => {
    const result = convertMarkdownToHtml('**bold**');
    expect(result).toContain('<strong>bold</strong>');
  });

  it('convertit un titre markdown', () => {
    const result = convertMarkdownToHtml('# Titre');
    expect(result).toContain('<h1>');
    expect(result).toContain('Titre');
  });

  it('retourne une chaîne vide pour une entrée vide', () => {
    expect(convertMarkdownToHtml('')).toBe('');
  });

  it('retourne une chaîne vide pour une entrée null-like', () => {
    expect(convertMarkdownToHtml(undefined as unknown as string)).toBe('');
    expect(convertMarkdownToHtml(null as unknown as string)).toBe('');
  });

  it('convertit les listes à puces', () => {
    const result = convertMarkdownToHtml('- item 1\n- item 2');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>');
  });

  it('convertit les liens', () => {
    const result = convertMarkdownToHtml('[Google](https://google.com)');
    expect(result).toContain('<a');
    expect(result).toContain('href="https://google.com"');
  });

  it("supporte l'extension highlight ==texte==", () => {
    const result = convertMarkdownToHtml('==surligné==');
    expect(result).toContain('<mark>');
    expect(result).toContain('surligné');
    expect(result).toContain('</mark>');
  });

  it('supporte le highlight avec du contenu inline', () => {
    const result = convertMarkdownToHtml('==**gras surligné**==');
    expect(result).toContain('<mark>');
    expect(result).toContain('<strong>');
  });
});
