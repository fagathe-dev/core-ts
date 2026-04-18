import { describe, it, expect } from 'vitest';
import { ensureDate } from './helper';

describe('ensureDate', () => {
  it('retourne la même instance Date si elle est valide', () => {
    const date = new Date('2024-01-15');
    const result = ensureDate(date);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBe(date.getTime());
  });

  it('parse une chaîne ISO valide', () => {
    const result = ensureDate('2024-06-15T10:30:00Z');
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(5); // juin = 5
    expect(result.getUTCDate()).toBe(15);
  });

  it('parse une chaîne date simple', () => {
    const result = ensureDate('2024-01-01');
    expect(result).toBeInstanceOf(Date);
  });

  it('lance une erreur pour un objet Date invalide', () => {
    expect(() => ensureDate(new Date('invalid'))).toThrow(
      'Invalid Date object passed',
    );
  });

  it('lance une erreur pour une chaîne invalide', () => {
    expect(() => ensureDate('not-a-date')).toThrow(
      'Invalid date string: not-a-date',
    );
  });

  it('lance une erreur pour une chaîne vide', () => {
    expect(() => ensureDate('')).toThrow('Invalid date string: ');
  });
});
