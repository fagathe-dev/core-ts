import { describe, it, expect } from 'vitest';
import { router } from './router';

describe('router', () => {
  it('retourne le chemin tel quel sans paramètres', () => {
    expect(router('/users')).toBe('/users');
  });

  it('remplace les paramètres de chemin', () => {
    expect(router('/users/{id}', { id: 42 })).toBe('/users/42');
  });

  it('remplace plusieurs paramètres de chemin', () => {
    expect(router('/lists/{listId}/items/{itemId}', { listId: 1, itemId: 5 })).toBe(
      '/lists/1/items/5'
    );
  });

  it('ajoute les paramètres restants en query string', () => {
    const result = router('/users', { page: 1, limit: 10 });
    expect(result).toContain('page=1');
    expect(result).toContain('limit=10');
    expect(result).toContain('?');
  });

  it('mélange paramètres de chemin et query string', () => {
    const result = router('/users/{id}', { id: 42, format: 'json' });
    expect(result).toBe('/users/42?format=json');
  });

  it('supprime les paramètres de chemin non trouvés', () => {
    const result = router('/users/{id}/posts/{postId}', { id: 1 });
    expect(result).toBe('/users/1/posts/');
  });

  it('nettoie les doubles slashes', () => {
    const result = router('/users//{id}', { id: '' as any });
    expect(result).not.toContain('//');
  });

  it('gère un objet params vide', () => {
    expect(router('/users', {})).toBe('/users');
  });
});
