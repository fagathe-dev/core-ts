import { describe, it, expect } from 'vitest';
import { DateFormatter } from './formatter';

describe('DateFormatter', () => {
  describe('todo', () => {
    it('formate une date en format compact', () => {
      const result = DateFormatter.todo('2025-04-02T15:00:00Z');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('lance une erreur pour une date invalide', () => {
      expect(() => DateFormatter.todo('invalid')).toThrow();
    });
  });

  describe('full', () => {
    it('formate une date en format complet', () => {
      const result = DateFormatter.full('2025-04-02T15:00:00Z');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('lance une erreur pour une date invalide', () => {
      expect(() => DateFormatter.full('invalid')).toThrow();
    });
  });

  describe('short', () => {
    it('formate une date en format court', () => {
      const result = DateFormatter.short('2025-04-02T15:00:00Z');
      expect(typeof result).toBe('string');
      // Format fr-FR court typique : "02/04/2025"
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('lance une erreur pour une date invalide', () => {
      expect(() => DateFormatter.short('invalid')).toThrow();
    });
  });

  describe('ago', () => {
    it('retourne "à l\'instant" pour une date récente', () => {
      const now = new Date();
      const result = DateFormatter.ago(now);
      expect(result).toBe("à l'instant");
    });

    it('retourne un format relatif pour des minutes', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = DateFormatter.ago(fiveMinutesAgo);
      expect(result).toContain('minute');
    });

    it('retourne un format relatif pour des heures', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      const result = DateFormatter.ago(threeHoursAgo);
      expect(result).toContain('heure');
    });

    it('retourne un format relatif pour des jours', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const result = DateFormatter.ago(twoDaysAgo);
      expect(typeof result).toBe('string');
    });

    it('lance une erreur pour une date invalide', () => {
      expect(() => DateFormatter.ago('invalid')).toThrow();
    });
  });
});
