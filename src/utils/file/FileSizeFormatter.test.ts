import { describe, it, expect } from 'vitest';
import { FileSizeFormatter } from './FileSizeFormatter';

describe('FileSizeFormatter', () => {
  describe('format', () => {
    it('retourne "0 octets" pour 0', () => {
      expect(FileSizeFormatter.format(0)).toBe('0 octets');
    });

    it('retourne "0 octets" pour null', () => {
      expect(FileSizeFormatter.format(null)).toBe('0 octets');
    });

    it('retourne "0 octets" pour undefined', () => {
      expect(FileSizeFormatter.format(undefined)).toBe('0 octets');
    });

    it('formate les octets', () => {
      expect(FileSizeFormatter.format(500)).toContain('octets');
    });

    it('formate les Ko', () => {
      const result = FileSizeFormatter.format(1024);
      expect(result).toContain('Ko');
    });

    it('formate les Mo', () => {
      const result = FileSizeFormatter.format(1024 * 1024);
      expect(result).toContain('Mo');
    });

    it('formate les Go', () => {
      const result = FileSizeFormatter.format(1024 * 1024 * 1024);
      expect(result).toContain('Go');
    });

    it('respecte la précision personnalisée', () => {
      const result = FileSizeFormatter.format(1536, 0);
      expect(result).toContain('Ko');
    });
  });

  describe('parse', () => {
    it('parse "10M" en octets', () => {
      expect(FileSizeFormatter.parse('10M')).toBe(10 * 1024 * 1024);
    });

    it('parse "500K" en octets', () => {
      expect(FileSizeFormatter.parse('500K')).toBe(500 * 1024);
    });

    it('parse "2G" en octets', () => {
      expect(FileSizeFormatter.parse('2G')).toBe(2 * 1024 * 1024 * 1024);
    });

    it('parse "1T" en octets', () => {
      expect(FileSizeFormatter.parse('1T')).toBe(1024 * 1024 * 1024 * 1024);
    });

    it('parse un nombre sans unité comme octets', () => {
      expect(FileSizeFormatter.parse('1024')).toBe(1024);
    });

    it('retourne 0 pour une chaîne vide', () => {
      expect(FileSizeFormatter.parse('')).toBe(0);
    });

    it('gère les espaces', () => {
      expect(FileSizeFormatter.parse(' 10 M ')).toBe(10 * 1024 * 1024);
    });

    it('gère "MB" ou "MO" (prend la première lettre)', () => {
      expect(FileSizeFormatter.parse('10MB')).toBe(10 * 1024 * 1024);
    });

    it('lance une erreur pour un format invalide', () => {
      expect(() => FileSizeFormatter.parse('abc')).toThrow(
        'FileSizeFormatter: Format de taille invalide'
      );
    });
  });

  describe('isValid', () => {
    it('retourne true si la taille est dans la limite', () => {
      expect(FileSizeFormatter.isValid(5 * 1024 * 1024, '10M')).toBe(true);
    });

    it('retourne true si la taille est exactement la limite', () => {
      expect(FileSizeFormatter.isValid(10 * 1024 * 1024, '10M')).toBe(true);
    });

    it('retourne false si la taille dépasse la limite', () => {
      expect(FileSizeFormatter.isValid(15 * 1024 * 1024, '10M')).toBe(false);
    });
  });
});
