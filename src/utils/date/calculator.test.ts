import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DateCalculator } from './calculator';

describe('DateCalculator', () => {
  describe('modify', () => {
    it('ajoute des jours', () => {
      const result = DateCalculator.modify('2024-01-15T00:00:00Z', { days: 5 });
      expect(result.getUTCDate()).toBe(20);
    });

    it('soustrait des jours', () => {
      const result = DateCalculator.modify('2024-01-15T00:00:00Z', {
        days: -5,
      });
      expect(result.getUTCDate()).toBe(10);
    });

    it('ajoute des mois', () => {
      const result = DateCalculator.modify('2024-01-15T00:00:00Z', {
        months: 3,
      });
      expect(result.getMonth()).toBe(
        new Date('2024-04-15T00:00:00Z').getMonth(),
      );
    });

    it('ajoute des années', () => {
      const result = DateCalculator.modify('2024-01-15T00:00:00Z', {
        years: 2,
      });
      expect(result.getFullYear()).toBe(2026);
    });

    it('ajoute des heures', () => {
      const result = DateCalculator.modify('2024-01-15T10:00:00Z', {
        hours: 5,
      });
      expect(result.getUTCHours()).toBe(15);
    });

    it('ajoute des minutes', () => {
      const result = DateCalculator.modify('2024-01-15T10:00:00Z', {
        minutes: 30,
      });
      expect(result.getUTCMinutes()).toBe(30);
    });

    it('combine plusieurs modifications', () => {
      const result = DateCalculator.modify('2024-01-15T00:00:00Z', {
        years: 1,
        months: 2,
        days: 3,
      });
      expect(result.getFullYear()).toBe(2025);
    });

    it('retourne une nouvelle instance (immutabilité)', () => {
      const original = new Date('2024-01-15T00:00:00Z');
      const result = DateCalculator.modify(original, { days: 5 });
      expect(result).not.toBe(original);
      expect(original.getUTCDate()).toBe(15); // L'original n'est pas modifié
    });

    it('lance une erreur pour une date invalide', () => {
      expect(() => DateCalculator.modify('invalid', { days: 1 })).toThrow();
    });
  });

  describe('isPast', () => {
    it('retourne true pour une date passée', () => {
      expect(DateCalculator.isPast('2000-01-01')).toBe(true);
    });

    it('retourne false pour une date future', () => {
      expect(DateCalculator.isPast('2099-12-31')).toBe(false);
    });
  });

  describe('isFuture', () => {
    it('retourne true pour une date future', () => {
      expect(DateCalculator.isFuture('2099-12-31')).toBe(true);
    });

    it('retourne false pour une date passée', () => {
      expect(DateCalculator.isFuture('2000-01-01')).toBe(false);
    });
  });

  describe('diff', () => {
    it('calcule la différence entre deux dates', () => {
      const result = DateCalculator.diff(
        '2024-01-01T00:00:00Z',
        '2024-01-02T00:00:00Z',
      );
      expect(result.days).toBe(1);
      expect(result.years).toBe(0);
      expect(result.months).toBe(0);
    });

    it("retourne une différence positive quelle que soit l'ordre", () => {
      const result1 = DateCalculator.diff('2024-01-01', '2024-01-10');
      const result2 = DateCalculator.diff('2024-01-10', '2024-01-01');
      expect(result1.days).toBe(result2.days);
    });

    it('calcule 0 pour deux dates identiques', () => {
      const d = '2024-06-15T12:00:00Z';
      const result = DateCalculator.diff(d, d);
      expect(result.years).toBe(0);
      expect(result.months).toBe(0);
      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });

    it('calcule la différence en années', () => {
      const result = DateCalculator.diff(
        '2020-01-01T00:00:00Z',
        '2023-01-01T00:00:00Z',
      );
      expect(result.years).toBe(3); // 3 * 365 = 1095 jours, / 365 = 3 mais floor-based
    });

    it('lance une erreur pour une date invalide', () => {
      expect(() => DateCalculator.diff('invalid')).toThrow();
    });
  });
});
