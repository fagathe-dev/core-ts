/**
 * Utilitaires de manipulation de chaînes de caractères
 */

const isJSON = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const randomStr = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const sanitize = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retire les accents
    .replace(/[-"']/g, '') // Retire quotes et tirets
    .toLowerCase();
};

const slugify = (str: string, separator: string = '-'): string => {
  return sanitize(str).trim().split(/\s+/).join(separator);
};

const truncate = (str: string, length: number): string => {
  return str.length > length ? `${str.slice(0, length)}...` : str;
};

const camelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase(),
    )
    .replace(/\s+/g, '');
};

const snakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // camelToSnake support
    .replace(/\s+/g, '_')
    .toLowerCase();
};

const kebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

const isEmpty = (str: string): boolean => str.trim().length === 0;

const isURL = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

/**
 * Échappe les caractères HTML spéciaux pour prévenir les injections XSS.
 */
const escapeHtml = (unsafe: string | null | undefined): string => {
  if (unsafe == null) return '';
  return unsafe
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Export direct des wrappers natifs pour cohérence
const encodeBase64 = (val: string) => btoa(val);
const decodeBase64 = (val: string) => atob(val);

export {
  isJSON,
  capitalize,
  randomStr,
  sanitize,
  slugify,
  truncate,
  camelCase,
  snakeCase,
  kebabCase,
  isEmpty,
  isURL,
  isEmail,
  escapeHtml,
  encodeBase64,
  decodeBase64,
};
