# DOM (Manipulation du DOM)

Utilitaires pour créer, insérer et sélectionner des éléments HTML.

## Import

```typescript
import { createElement } from 'core-ts';
import { insertElementToDOM } from 'core-ts';
import { $ } from 'core-ts';
```

## Fonctions

### `createElement(tagName, classes?, id?, attributes?)`

Crée un élément HTML avec des classes, un ID et des attributs optionnels.

```typescript
// Élément simple
const div = createElement('div');

// Avec classes et ID
const card = createElement('div', 'card shadow-sm', 'my-card');

// Avec attributs
const input = createElement('input', 'form-control', 'email-field', {
  type: 'email',
  placeholder: 'Email...',
  required: true,    // Attribut booléen -> attribut sans valeur
  disabled: false,   // false -> ignoré (non ajouté)
});
```

**Gestion des attributs :**
- `true` → attribut booléen (ex: `required=""`)
- `false` / `null` / `undefined` → attribut ignoré
- `string` / `number` → valeur standard

### `insertElementToDOM(element, position, parent)`

Insère un élément ou une chaîne HTML dans le DOM à une position spécifique.

```typescript
// Insérer un élément à la fin du body
const el = createElement('div', 'toast');
insertElementToDOM(el, null, null);

// Insérer du HTML au début d'un conteneur
const container = document.getElementById('app');
insertElementToDOM('<p>Hello</p>', 'afterbegin', container);
```

**Positions disponibles** (`InsertPosition`) :
- `'beforebegin'` – Avant l'élément parent
- `'afterbegin'` – Au début du parent (premier enfant)
- `'beforeend'` – À la fin du parent (dernier enfant) — **défaut**
- `'afterend'` – Après l'élément parent

**Valeurs par défaut :**
- `position = null` → `'beforeend'`
- `parent = null` → `document.body`

### `$(selector, asList?, parent?)`

Sélecteur CSS simplifié inspiré de jQuery.

```typescript
// Sélectionner un seul élément
const header = $<HTMLElement>('.header');

// Forcer le retour en NodeList
const items = $<HTMLLIElement>('.item', true);

// Rechercher dans un parent spécifique
const form = $<HTMLFormElement>('#my-form');
const inputs = $<HTMLInputElement>('input', true, form);
```

**Comportement :**
- 1 élément trouvé + `asList = false` → retourne l'élément directement
- Plusieurs éléments ou `asList = true` → retourne un `NodeListOf<T>`
- Aucun élément → retourne `null`
