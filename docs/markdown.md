# Markdown Parser

Convertisseur Markdown vers HTML basé sur la librairie `marked`, avec une extension personnalisée pour le surlignage.

## Import

```typescript
import { convertMarkdownToHtml } from '@/utils/features/marked';
```

## Utilisation

### Conversion basique

```typescript
const html = convertMarkdownToHtml('# Titre\n\nUn paragraphe avec du **gras**.');
// <h1>Titre</h1><p>Un paragraphe avec du <strong>gras</strong>.</p>
```

### Surlignage (Highlight)

L'extension ajoute le support de la syntaxe `==texte==` qui sera convertie en `<mark>texte</mark>`.

```typescript
const html = convertMarkdownToHtml('Voici un ==texte surligné== dans un paragraphe.');
// <p>Voici un <mark>texte surligné</mark> dans un paragraphe.</p>
```

Le surlignage supporte le formatage imbriqué :

```typescript
const html = convertMarkdownToHtml('==**gras surligné**==');
// <mark><strong>gras surligné</strong></mark>
```

### Valeurs vides

Si la chaîne est vide ou falsy, la fonction retourne une chaîne vide :

```typescript
convertMarkdownToHtml('');  // ''
convertMarkdownToHtml(null); // ''
```

## Options

- Le parsing est **synchrone** (`async: false`)
- Le mode **GFM** (GitHub Flavored Markdown) est activé par défaut

## Extension Highlight

L'extension `highlightExtension` est automatiquement chargée au moment de l'import du module. Elle est disponible en export si besoin de la réutiliser dans un autre contexte :

```typescript
import { highlightExtension } from '@/utils/features/marked';
```
