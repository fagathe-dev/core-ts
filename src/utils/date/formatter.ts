// public/ts/utils/date/DateFormatter.ts

import { DateInput } from '@/types/index.d';
import { ensureDate } from './helper';

export class DateFormatter {
  static readonly LOCALE = 'fr-FR';
  static readonly TIMEZONE = 'Europe/Paris';

  /**
   * Format compact pour les listes : "2 déc. 15:00"
   */
  static todo(date: DateInput): string {
    const d = ensureDate(date);
    const formatted = new Intl.DateTimeFormat(this.LOCALE, {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: this.TIMEZONE,
    }).format(d);

    return formatted.replace(' à', '');
  }

  /**
   * Format complet : "mercredi 2 avril 2025 à 23:29"
   */
  static full(date: DateInput): string {
    const d = ensureDate(date);
    return new Intl.DateTimeFormat(this.LOCALE, {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: this.TIMEZONE,
    }).format(d);
  }

  /**
   * Format court : "12/12/2023"
   */
  static short(date: DateInput): string {
    const d = ensureDate(date);
    return new Intl.DateTimeFormat(this.LOCALE, {
      dateStyle: 'short',
      timeZone: this.TIMEZONE,
    }).format(d);
  }

  /**
   * Format relatif : "il y a 5 minutes", "à l'instant"
   */
  static ago(date: DateInput): string {
    const d = ensureDate(date);
    const now = new Date();
    const diffInSeconds = (d.getTime() - now.getTime()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(this.LOCALE, { numeric: 'auto' });

    if (Math.abs(diffInSeconds) < 60) {
      return "à l'instant";
    }

    const minutes = diffInSeconds / 60;
    if (Math.abs(minutes) < 60) {
      return rtf.format(Math.round(minutes), 'minute');
    }

    const hours = minutes / 60;
    if (Math.abs(hours) < 24) {
      return rtf.format(Math.round(hours), 'hour');
    }

    const days = hours / 24;
    if (Math.abs(days) < 30) {
      return rtf.format(Math.round(days), 'day');
    }

    const months = days / 30;
    if (Math.abs(months) < 12) {
      return rtf.format(Math.round(months), 'month');
    }

    const years = days / 365;
    return rtf.format(Math.round(years), 'year');
  }
}
