# Clipboard (Presse-papier)

Utilitaires pour copier du texte dans le presse-papier avec gestion de fallback et feedback visuel.

## Import

```typescript
import {
  copyToClipboard,
  copyWithButtonFeedback,
  initClipboardHandlers,
  copyElementContent,
  isClipboardSupported,
} from '@/utils/features/clipboard';
```

## Fonctions

### `copyToClipboard(text, options?)`

Copie du texte dans le presse-papier. Utilise l'API Clipboard moderne avec fallback `execCommand` pour les navigateurs anciens.

```typescript
const result = await copyToClipboard('Texte à copier');

if (result.success) {
  console.log('Copié !');
} else {
  console.error(result.error);
}
```

### `copyWithButtonFeedback(button, text, options?)`

Copie du texte et affiche un feedback visuel directement sur le bouton (changement d'icône et de classe CSS).

```typescript
const button = document.getElementById('copy-btn');
await copyWithButtonFeedback(button, 'Texte à copier', {
  successMessage: 'Copié !',
  errorMessage: 'Erreur',
  feedbackDuration: 2000,
});
```

Le bouton affiche temporairement un état de succès (classe `btn-success`) ou d'erreur (classe `btn-danger`), puis revient à son état initial.

### `initClipboardHandlers()`

Initialise automatiquement les gestionnaires de copie pour tous les éléments possédant l'attribut `data-copy-target`.

```html
<pre id="code-block"><code>console.log('hello');</code></pre>
<button data-copy-target="code-block">Copier</button>
```

```typescript
initClipboardHandlers();
// Tous les boutons avec data-copy-target sont maintenant fonctionnels
```

### `copyElementContent(elementId, options?)`

Copie le contenu textuel d'un élément DOM par son ID.

```typescript
const result = await copyElementContent('my-element');
```

### `isClipboardSupported()`

Vérifie si l'API Clipboard est disponible dans le navigateur.

```typescript
if (isClipboardSupported()) {
  // Afficher le bouton de copie
}
```

## Options (`ClipboardOptions`)

| Option             | Type      | Défaut         | Description                              |
|--------------------|-----------|----------------|------------------------------------------|
| `showFeedback`     | `boolean` | `true`         | Afficher un feedback visuel              |
| `feedbackDuration` | `number`  | `2000`         | Durée du feedback en millisecondes       |
| `successMessage`   | `string`  | `'Copié !'`    | Message affiché en cas de succès         |
| `errorMessage`     | `string`  | `'Erreur...'`  | Message affiché en cas d'erreur          |

## Retour (`ClipboardResult`)

```typescript
interface ClipboardResult {
  success: boolean;
  error?: string;
}
```
