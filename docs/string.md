# String (Manipulation de chaînes)

Utilitaires de manipulation et de validation de chaînes de caractères.

## Import

```typescript
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
} from 'core-ts';
```

## Transformation

### `capitalize(str)`

Met la première lettre en majuscule et le reste en minuscule.

```typescript
capitalize('hello WORLD'); // 'Hello world'
```

### `slugify(str, separator?)`

Convertit une chaîne en slug URL-friendly (minuscules, sans accents, espaces remplacés).

```typescript
slugify('Mon Article de Blog');    // 'mon-article-de-blog'
slugify('Mon Article', '_');       // 'mon_article'
```

### `sanitize(str)`

Retire les accents, les quotes, les tirets et passe en minuscules.

```typescript
sanitize('Café-Crème'); // 'cafecreme'
```

### `truncate(str, length)`

Tronque la chaîne à la longueur donnée et ajoute `...`.

```typescript
truncate('Un texte très long', 10); // 'Un texte t...'
```

### `camelCase(str)`

Convertit en camelCase.

```typescript
camelCase('hello world'); // 'helloWorld'
```

### `snakeCase(str)`

Convertit en snake_case.

```typescript
snakeCase('helloWorld');   // 'hello_world'
snakeCase('Hello World'); // 'hello_world'
```

### `kebabCase(str)`

Convertit en kebab-case.

```typescript
kebabCase('helloWorld');   // 'hello-world'
kebabCase('Hello World'); // 'hello-world'
```

### `randomStr(length)`

Génère une chaîne aléatoire alphanumerique de la longueur spécifiée.

```typescript
randomStr(8); // ex: 'aB3kLm9x'
```

### `escapeHtml(unsafe)`

Échappe les caractères HTML spéciaux pour prévenir les injections XSS.

```typescript
escapeHtml('<script>alert("xss")</script>');
// '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```

## Encodage Base64

```typescript
encodeBase64('Hello');   // 'SGVsbG8='
decodeBase64('SGVsbG8='); // 'Hello'
```

## Validation

### `isEmpty(str)`

Vérifie si la chaîne est vide (après trim).

```typescript
isEmpty('   '); // true
isEmpty('hi');  // false
```

### `isJSON(value)`

Vérifie si la chaîne est du JSON valide.

```typescript
isJSON('{"key": "value"}'); // true
isJSON('not json');          // false
```

### `isURL(value)`

Vérifie si la chaîne est une URL valide.

```typescript
isURL('https://example.com'); // true
isURL('not-a-url');           // false
```

### `isEmail(value)`

Vérifie si la chaîne est un email valide.

```typescript
isEmail('user@example.com'); // true
isEmail('invalid');           // false
```
