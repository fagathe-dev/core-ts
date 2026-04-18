import { describe, it, expect, beforeEach } from 'vitest';
import { CookieHelper } from './cookies';

describe('CookieHelper', () => {
  beforeEach(() => {
    // Nettoyer les cookies avant chaque test
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });
  });

  describe('set / get', () => {
    it('définit et récupère un cookie', () => {
      CookieHelper.set('test_key', 'test_value');
      expect(CookieHelper.get('test_key')).toBe('test_value');
    });

    it("retourne la valeur par défaut si le cookie n'existe pas", () => {
      expect(CookieHelper.get('inexistant')).toBeNull();
      expect(CookieHelper.get('inexistant', 'fallback')).toBe('fallback');
    });
  });

  describe('has', () => {
    it('retourne true si le cookie existe', () => {
      CookieHelper.set('exists', 'yes');
      expect(CookieHelper.has('exists')).toBe(true);
    });

    it("retourne false si le cookie n'existe pas", () => {
      expect(CookieHelper.has('nope')).toBe(false);
    });
  });

  describe('delete', () => {
    it('supprime un cookie existant', () => {
      CookieHelper.set('to_delete', 'value');
      expect(CookieHelper.has('to_delete')).toBe(true);
      CookieHelper.delete('to_delete');
      expect(CookieHelper.has('to_delete')).toBe(false);
    });
  });

  describe('getAll', () => {
    it('retourne un objet vide si aucun cookie', () => {
      const all = CookieHelper.getAll();
      expect(typeof all).toBe('object');
    });

    it('retourne tous les cookies définis', () => {
      CookieHelper.set('a', '1');
      CookieHelper.set('b', '2');
      const all = CookieHelper.getAll();
      expect(all['a']).toBe('1');
      expect(all['b']).toBe('2');
    });
  });

  describe('clear', () => {
    it('supprime tous les cookies', () => {
      CookieHelper.set('x', '1');
      CookieHelper.set('y', '2');
      CookieHelper.clear();
      expect(CookieHelper.has('x')).toBe(false);
      expect(CookieHelper.has('y')).toBe(false);
    });
  });
});
