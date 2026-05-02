// public/ts/utils/date/DateCalculator.ts

import { DateDiff, DateModifierOptions, DateInput } from '../../types/index.d'; // Vos types existants
import { ensureDate } from './helper';

export class DateCalculator {
  /**
   * Modifie une date en ajoutant/soustrayant des unités.
   * Retourne une NOUVELLE instance (Immutabilité).
   */
  static modify(date: DateInput, options: DateModifierOptions): Date {
    const d = new Date(ensureDate(date)); // Clone immédiat

    if (options.years) d.setFullYear(d.getFullYear() + options.years);
    if (options.months) d.setMonth(d.getMonth() + options.months);
    if (options.days) d.setDate(d.getDate() + options.days);
    if (options.hours) d.setHours(d.getHours() + options.hours);
    if (options.minutes) d.setMinutes(d.getMinutes() + options.minutes);

    return d;
  }

  /**
   * Vérifie strictement si la date cible est dans le passé par rapport à maintenant.
   */
  static isPast(date: DateInput): boolean {
    const d = ensureDate(date);
    return d.getTime() < Date.now();
  }

  /**
   * Vérifie si la date cible est dans le futur.
   */
  static isFuture(date: DateInput): boolean {
    const d = ensureDate(date);
    return d.getTime() > Date.now();
  }

  /**
   * Calcule la différence détaillée entre deux dates.
   */
  static diff(date1: DateInput, date2: DateInput = new Date()): DateDiff {
    const d1 = ensureDate(date1);
    const d2 = ensureDate(date2);

    let diffMs = Math.abs(d2.getTime() - d1.getTime());

    // Constantes
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const YEAR = DAY * 365;
    const MONTH = DAY * 30; // Approximation standard

    const years = Math.floor(diffMs / YEAR);
    diffMs -= years * YEAR;

    const months = Math.floor(diffMs / MONTH);
    diffMs -= months * MONTH;

    const days = Math.floor(diffMs / DAY);
    diffMs -= days * DAY;

    const hours = Math.floor(diffMs / HOUR);
    diffMs -= hours * HOUR;

    const minutes = Math.floor(diffMs / MINUTE);
    diffMs -= minutes * MINUTE;

    const seconds = Math.floor(diffMs / SECOND);

    return { years, months, days, hours, minutes, seconds };
  }
}
