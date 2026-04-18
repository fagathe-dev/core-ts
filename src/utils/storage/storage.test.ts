import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from './storage';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('localStorage (défaut)', () => {
    it('stocke et récupère une chaîne', () => {
      const storage = new StorageService('local');
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
    });

    it('stocke et récupère un objet JSON', () => {
      const storage = new StorageService('local');
      const obj = { name: 'test', count: 42 };
      storage.set('obj', obj);
      expect(storage.get('obj')).toEqual(obj);
    });

    it('stocke et récupère un tableau', () => {
      const storage = new StorageService('local');
      const arr = [1, 2, 3];
      storage.set('arr', arr);
      expect(storage.get('arr')).toEqual(arr);
    });

    it('stocke un nombre (retourné parsé en JSON)', () => {
      const storage = new StorageService('local');
      storage.set('num', 42);
      expect(storage.get('num')).toBe(42);
    });

    it('stocke un booléen (retourné parsé en JSON)', () => {
      const storage = new StorageService('local');
      storage.set('bool', true);
      expect(storage.get('bool')).toBe(true);
    });

    it('retourne null pour une clé inexistante', () => {
      const storage = new StorageService('local');
      expect(storage.get('nope')).toBeNull();
    });

    it('ne stocke pas undefined', () => {
      const storage = new StorageService('local');
      const result = storage.set('undef', undefined);
      expect(result).toBe(true);
      expect(storage.get('undef')).toBeNull();
    });

    it('supprime une clé', () => {
      const storage = new StorageService('local');
      storage.set('key', 'val');
      storage.remove('key');
      expect(storage.get('key')).toBeNull();
    });

    it('vide tout le stockage', () => {
      const storage = new StorageService('local');
      storage.set('a', '1');
      storage.set('b', '2');
      storage.clear();
      expect(storage.get('a')).toBeNull();
      expect(storage.get('b')).toBeNull();
    });
  });

  describe('sessionStorage', () => {
    it('stocke et récupère via sessionStorage', () => {
      const storage = new StorageService('session');
      storage.set('session_key', 'session_val');
      expect(storage.get('session_key')).toBe('session_val');
    });
  });

  describe("set retourne false en cas d'erreur de quota", () => {
    it("gère l'erreur QuotaExceededError", () => {
      const storage = new StorageService('local');
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Simuler une erreur de quota
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const error = new DOMException('Quota exceeded', 'QuotaExceededError');
        throw error;
      });

      const result = storage.set('big', 'data');
      expect(result).toBe(false);

      consoleSpy.mockRestore();
      vi.restoreAllMocks();
    });
  });
});
