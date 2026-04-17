import { DateInput } from '@/types/index.d';

/**
 * Garantit qu'une valeur est bien un objet Date valide.
 * Accepte une instance de Date ou une chaîne ISO.
 */
export function ensureDate(date: DateInput): Date {
  if (date instanceof Date) {
    // Petit check de sécurité pour les dates invalides "Invalid Date"
    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date object passed');
    }
    return date;
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date string: ${date}`);
  }

  return parsedDate;
}
