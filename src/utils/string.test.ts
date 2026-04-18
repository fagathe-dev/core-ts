import { describe, it, expect } from 'vitest';
import {
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
} from './string';

describe('isJSON', () => {
  it('retourne true pour un objet JSON valide', () => {
    expect(isJSON('{"key":"value"}')).toBe(true);
  });

  it('retourne true pour un tableau JSON', () => {
    expect(isJSON('[1, 2, 3]')).toBe(true);
  });

  it('retourne true pour une chaîne JSON (string)', () => {
    expect(isJSON('"hello"')).toBe(true);
  });

  it('retourne true pour un nombre JSON', () => {
    expect(isJSON('42')).toBe(true);
  });

  it('retourne true pour null JSON', () => {
    expect(isJSON('null')).toBe(true);
  });

  it('retourne false pour une chaîne invalide', () => {
    expect(isJSON('{invalid}')).toBe(false);
  });

  it('retourne false pour une chaîne vide', () => {
    expect(isJSON('')).toBe(false);
  });

  it('retourne false pour du texte brut', () => {
    expect(isJSON('hello world')).toBe(false);
  });
});

describe('capitalize', () => {
  it('met en majuscule la première lettre', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('met le reste en minuscules', () => {
    expect(capitalize('hELLO')).toBe('Hello');
  });

  it('gère une chaîne d\'un seul caractère', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('gère une chaîne vide', () => {
    expect(capitalize('')).toBe('');
  });

  it('gère une chaîne déjà capitalisée', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });
});

describe('randomStr', () => {
  it('génère une chaîne de la longueur demandée', () => {
    expect(randomStr(10)).toHaveLength(10);
    expect(randomStr(0)).toHaveLength(0);
    expect(randomStr(50)).toHaveLength(50);
  });

  it('ne contient que des caractères alphanumériques', () => {
    const result = randomStr(100);
    expect(result).toMatch(/^[A-Za-z0-9]+$/);
  });

  it('retourne une chaîne vide pour une longueur de 0', () => {
    expect(randomStr(0)).toBe('');
  });
});

describe('sanitize', () => {
  it('retire les accents', () => {
    expect(sanitize('éàü')).toBe('eau');
  });

  it('retire les quotes et tirets', () => {
    expect(sanitize("l'arbre-vert")).toBe('larbrevert');
  });

  it('met tout en minuscules', () => {
    expect(sanitize('HELLO')).toBe('hello');
  });

  it('gère une chaîne vide', () => {
    expect(sanitize('')).toBe('');
  });

  it('gère une chaîne avec accents et caractères spéciaux', () => {
    expect(sanitize('Café "Crème"')).toBe('cafe creme');
  });
});

describe('slugify', () => {
  it('crée un slug standard avec tirets', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('utilise un séparateur personnalisé', () => {
    expect(slugify('Hello World', '_')).toBe('hello_world');
  });

  it('retire les accents et caractères spéciaux', () => {
    expect(slugify('Café Crème')).toBe('cafe-creme');
  });

  it('gère les espaces multiples', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
  });

  it('gère une chaîne vide', () => {
    expect(slugify('')).toBe('');
  });
});

describe('truncate', () => {
  it('tronque une chaîne trop longue', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });

  it('ne tronque pas si la chaîne est plus courte', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  it('ne tronque pas si la longueur est exacte', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('gère une chaîne vide', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('gère une longueur de 0', () => {
    expect(truncate('Hello', 0)).toBe('...');
  });
});

describe('camelCase', () => {
  it('convertit en camelCase', () => {
    expect(camelCase('hello world')).toBe('helloWorld');
  });

  it('gère une chaîne d\'un seul mot', () => {
    expect(camelCase('hello')).toBe('hello');
  });

  it('gère une chaîne vide', () => {
    expect(camelCase('')).toBe('');
  });

  it('gère plusieurs mots', () => {
    expect(camelCase('foo bar baz')).toBe('fooBarBaz');
  });
});

describe('snakeCase', () => {
  it('convertit espaces en underscores', () => {
    expect(snakeCase('hello world')).toBe('hello_world');
  });

  it('convertit camelCase en snake_case', () => {
    expect(snakeCase('helloWorld')).toBe('hello_world');
  });

  it('gère une chaîne vide', () => {
    expect(snakeCase('')).toBe('');
  });

  it('tout en minuscules', () => {
    expect(snakeCase('Hello World')).toBe('hello_world');
  });
});

describe('kebabCase', () => {
  it('convertit espaces en tirets', () => {
    expect(kebabCase('hello world')).toBe('hello-world');
  });

  it('convertit camelCase en kebab-case', () => {
    expect(kebabCase('helloWorld')).toBe('hello-world');
  });

  it('gère une chaîne vide', () => {
    expect(kebabCase('')).toBe('');
  });

  it('tout en minuscules', () => {
    expect(kebabCase('Hello World')).toBe('hello-world');
  });
});

describe('isEmpty', () => {
  it('retourne true pour une chaîne vide', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('retourne true pour des espaces uniquement', () => {
    expect(isEmpty('   ')).toBe(true);
  });

  it('retourne false pour une chaîne non vide', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  it('retourne false pour une chaîne avec espaces et contenu', () => {
    expect(isEmpty(' a ')).toBe(false);
  });
});

describe('isURL', () => {
  it('retourne true pour une URL http valide', () => {
    expect(isURL('http://example.com')).toBe(true);
  });

  it('retourne true pour une URL https valide', () => {
    expect(isURL('https://example.com/path?q=1')).toBe(true);
  });

  it('retourne false pour une chaîne quelconque', () => {
    expect(isURL('not a url')).toBe(false);
  });

  it('retourne false pour une chaîne vide', () => {
    expect(isURL('')).toBe(false);
  });

  it('retourne true pour une URL avec protocole custom', () => {
    expect(isURL('ftp://files.example.com')).toBe(true);
  });
});

describe('isEmail', () => {
  it('retourne true pour un email valide', () => {
    expect(isEmail('test@example.com')).toBe(true);
  });

  it('retourne false pour une chaîne sans @', () => {
    expect(isEmail('testexample.com')).toBe(false);
  });

  it('retourne false pour une chaîne sans domaine', () => {
    expect(isEmail('test@')).toBe(false);
  });

  it('retourne false pour une chaîne vide', () => {
    expect(isEmail('')).toBe(false);
  });

  it('retourne false pour un email avec espace', () => {
    expect(isEmail('test @example.com')).toBe(false);
  });

  it('retourne true pour un email avec sous-domaine', () => {
    expect(isEmail('user@mail.example.com')).toBe(true);
  });
});

describe('escapeHtml', () => {
  it('échappe les chevrons', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('échappe les guillemets', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('échappe les apostrophes', () => {
    expect(escapeHtml("l'arbre")).toBe("l&#039;arbre");
  });

  it('échappe les esperluettes', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('retourne une chaîne vide pour null', () => {
    expect(escapeHtml(null)).toBe('');
  });

  it('retourne une chaîne vide pour undefined', () => {
    expect(escapeHtml(undefined)).toBe('');
  });

  it('gère une chaîne vide', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('gère un mélange de caractères spéciaux', () => {
    expect(escapeHtml('<div class="a">&</div>')).toBe(
      '&lt;div class=&quot;a&quot;&gt;&amp;&lt;/div&gt;'
    );
  });
});

describe('encodeBase64 / decodeBase64', () => {
  it('encode et décode une chaîne simple', () => {
    const original = 'Hello World';
    const encoded = encodeBase64(original);
    expect(encoded).toBe('SGVsbG8gV29ybGQ=');
    expect(decodeBase64(encoded)).toBe(original);
  });

  it('gère une chaîne vide', () => {
    expect(encodeBase64('')).toBe('');
    expect(decodeBase64('')).toBe('');
  });
});
