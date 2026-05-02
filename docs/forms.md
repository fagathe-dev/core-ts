# Forms (Gestion des formulaires)

Utilitaires pour gérer les formulaires HTML : extraction de données, remplissage, validation et reset.

## Import

```typescript
import { FormManager } from '@/utils/forms/FormManager';
import { SelectableField } from '@/utils/forms/selectable';
```

## FormManager

Classe pour gérer un formulaire HTML complet (extraction, remplissage, validation, reset).

### Initialisation

```typescript
const form = document.getElementById('my-form') as HTMLFormElement;

const manager = new FormManager({
  form,
  initialData: { name: 'John', email: 'john@example.com' },
});
```

Le formulaire est automatiquement rempli avec les `initialData` à l'initialisation.

### `manager.getData()`

Extrait les données de tous les champs du formulaire.

```typescript
const data = manager.getData();
// { name: 'John', email: 'john@example.com', role: 'admin', tags: ['js', 'ts'] }
```

Gère automatiquement :
- `input[type="text|number|date|password|hidden"]` → `string | null`
- `input[type="checkbox"]` → `string[] | null`
- `input[type="radio"]` → `string | null`
- `select` → `string | string[] | null`
- `textarea` → `string | null`

### `manager.fillData(data)`

Remplit le formulaire avec un objet de données.

```typescript
manager.fillData({
  name: 'Jane',
  role: 'editor',
  tags: ['css', 'html'], // Pour les checkboxes
});
```

### `manager.validateData(violations)`

Affiche les erreurs de validation sur les champs correspondants.

```typescript
manager.validateData({
  email: 'Email invalide',
  name: 'Le nom est requis',
});
```

- Ajoute la classe `is-invalid` sur les champs en erreur
- Ajoute la classe `is-valid` sur les champs sans erreur
- Insère un élément `<small class="invalid-feedback">` avec le message

### `manager.reset()`

Réinitialise tous les champs et supprime les classes de validation.

```typescript
manager.reset();
```

L'événement natif `reset` du formulaire appelle automatiquement cette méthode.

## SelectableField

Composant pour des champs de sélection visuels (pastilles cliquables) en mode radio ou checkbox.

### Initialisation

```typescript
const container = document.querySelector('.form-selectable') as HTMLElement;

const selectable = new SelectableField(container, { mode: 'radio' });
```

### Options

| Option | Type                   | Défaut   | Description                                  |
|--------|------------------------|----------|----------------------------------------------|
| `mode` | `'radio' \| 'checkbox'` | `'radio'` | Mode de sélection (unique ou multiple)      |

### Structure HTML attendue

```html
<div class="form-selectable">
  <div class="form-selectable-item">
    <input type="radio" class="form-selectable-input" name="priority" value="low">
    <span>Basse</span>
  </div>
  <div class="form-selectable-item">
    <input type="radio" class="form-selectable-input" name="priority" value="high">
    <span>Haute</span>
  </div>
</div>
```

### Comportement

- **Mode radio** : une seule sélection possible, impossible de désélectionner
- **Mode checkbox** : sélection multiple, possibilité de tout désélectionner
- La classe CSS `active` est ajoutée/retirée automatiquement sur les `.form-selectable-item`
- Les classes de validation (`is-valid`, `is-invalid`) sont propagées de l'input vers l'item visuel

## Actions sur les champs

Des fonctions utilitaires granulaires sont disponibles pour manipuler les champs individuellement :

```typescript
import { clearInput, clearSelect, clearTextarea, clearCheck } from '@/utils/forms/field-actions/clear';
import { fillTextarea, fillInput, fillRadio, selectOption, fillCheckboxes } from '@/utils/forms/field-actions/fill';
import { getInputValue, getSelectValue, getTextareaValue, getCheckboxesValue, getRadioValue } from '@/utils/forms/field-actions/get';
```

### Clear

```typescript
clearInput(inputEl);      // Vide un input (ou décoche si checkbox/radio)
clearSelect(selectEl);    // Désélectionne toutes les options
clearTextarea(textareaEl); // Vide le textarea
clearCheck(inputEl);      // Décoche un checkbox/radio
```

### Fill

```typescript
fillTextarea(textareaEl, 'Contenu');
fillInput(inputEl, 'valeur');
fillRadio('fieldName', 'value');
selectOption(selectEl, 'option-value');        // Select simple
selectOption(selectEl, ['val1', 'val2']);       // Select multiple
fillCheckboxes('fieldName', ['val1', 'val2']);
```

### Get

```typescript
getInputValue(inputEl);              // string | null
getSelectValue(selectEl);            // string | string[] | null
getTextareaValue(textareaEl);        // string | null
getCheckboxesValue(checkboxNodeList); // string[] | null
getRadioValue(radioNodeList);        // string | null
```

Toutes ces fonctions déclenchent les événements `input` ou `change` appropriés pour la réactivité.
