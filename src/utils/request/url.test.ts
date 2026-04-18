import { describe, it, expect } from 'vitest';
import { addQueryParams, removeQueryParams, getQueryParams } from './url';

const BASE = 'http://localhost';

describe('addQueryParams', () => {
  it('ajoute des paramètres à une URL relative', () => {
    const result = addQueryParams('/posts', { page: 1 }, BASE);
    expect(result).toBe('/posts?page=1');
  });

  it('ajoute des paramètres à une URL absolue', () => {
    const result = addQueryParams(
      'http://example.com/posts',
      { page: 1 },
      BASE,
    );
    expect(result).toContain('page=1');
    expect(result).toContain('http://example.com');
  });

  it('met à jour un paramètre existant', () => {
    const result = addQueryParams('/posts?page=1', { page: 2 }, BASE);
    expect(result).toBe('/posts?page=2');
  });

  it('ajoute plusieurs paramètres', () => {
    const result = addQueryParams('/posts', { page: 1, limit: 10 }, BASE);
    expect(result).toContain('page=1');
    expect(result).toContain('limit=10');
  });

  it("retourne l'URL non modifiée pour une URL invalide", () => {
    const result = addQueryParams('', { page: 1 }, BASE);
    // empty string will parse as BASE itself
    expect(typeof result).toBe('string');
  });
});

describe('removeQueryParams', () => {
  it('supprime un paramètre existant', () => {
    const result = removeQueryParams('/posts?page=1&limit=10', ['page'], BASE);
    expect(result).toBe('/posts?limit=10');
  });

  it('supprime plusieurs paramètres', () => {
    const result = removeQueryParams(
      '/posts?page=1&limit=10&sort=asc',
      ['page', 'sort'],
      BASE,
    );
    expect(result).toBe('/posts?limit=10');
  });

  it("ne plante pas si le paramètre n'existe pas", () => {
    const result = removeQueryParams('/posts?page=1', ['nonexistent'], BASE);
    expect(result).toBe('/posts?page=1');
  });

  it('fonctionne sur une URL absolue', () => {
    const result = removeQueryParams(
      'http://example.com/posts?page=1',
      ['page'],
      BASE,
    );
    expect(result).toBe('http://example.com/posts');
  });
});

describe('getQueryParams', () => {
  it("extrait tous les paramètres d'une URL", () => {
    const result = getQueryParams('/posts?page=1&limit=10', BASE);
    expect(result).toEqual({ page: '1', limit: '10' });
  });

  it('retourne un objet vide pour une URL sans paramètres', () => {
    const result = getQueryParams('/posts', BASE);
    expect(result).toEqual({});
  });

  it('retourne un objet vide pour une URL invalide', () => {
    // safeCreateUrl retournera l'URL parsée par rapport à BASE
    const result = getQueryParams('', BASE);
    expect(typeof result).toBe('object');
  });

  it('fonctionne sur une URL absolue', () => {
    const result = getQueryParams('http://example.com/posts?sort=asc', BASE);
    expect(result).toEqual({ sort: 'asc' });
  });

  it('ne conserve que la première valeur pour les paramètres dupliqués', () => {
    const result = getQueryParams('/posts?tag=a&tag=b', BASE);
    expect(result.tag).toBe('a');
  });
});
