# Date (Manipulation de dates)

Classes utilitaires pour le formatage, le calcul et la validation de dates.

## Import

```typescript
import { DateFormatter } from 'core-ts';
import { DateCalculator } from 'core-ts';
import { ensureDate } from 'core-ts';
```

## DateFormatter

Formateur de dates en français (`fr-FR`, timezone `Europe/Paris`).

### `DateFormatter.todo(date)`

Format compact pour les listes : `"2 déc. 15:00"`.

```typescript
DateFormatter.todo('2025-12-02T15:00:00');
// '2 déc. 15:00'
```

### `DateFormatter.full(date)`

Format complet avec jour de la semaine.

```typescript
DateFormatter.full('2025-04-02T23:29:00');
// 'mercredi 2 avril 2025 à 23:29'
```

### `DateFormatter.short(date)`

Format court numérique.

```typescript
DateFormatter.short('2023-12-12');
// '12/12/2023'
```

### `DateFormatter.ago(date)`

Format relatif humain.

```typescript
DateFormatter.ago(new Date(Date.now() - 5 * 60 * 1000));
// 'il y a 5 minutes'

DateFormatter.ago(new Date(Date.now() - 1000));
// "à l'instant"
```

## DateCalculator

Classe pour les calculs et comparaisons de dates.

### `DateCalculator.modify(date, options)`

Modifie une date en ajoutant ou soustrayant des unités. Retourne une **nouvelle instance** (immutable).

```typescript
const future = DateCalculator.modify('2025-01-01', { days: 10, months: 1 });
// 2025-02-11

const past = DateCalculator.modify(new Date(), { years: -1 });
// Date il y a un an
```

Options disponibles : `years`, `months`, `days`, `hours`, `minutes`.

### `DateCalculator.isPast(date)`

Vérifie si la date est dans le passé.

```typescript
DateCalculator.isPast('2020-01-01'); // true
DateCalculator.isPast('2030-01-01'); // false
```

### `DateCalculator.isFuture(date)`

Vérifie si la date est dans le futur.

```typescript
DateCalculator.isFuture('2030-01-01'); // true
```

### `DateCalculator.diff(date1, date2?)`

Calcule la différence détaillée entre deux dates. Si `date2` n'est pas fourni, utilise la date actuelle.

```typescript
const diff = DateCalculator.diff('2024-01-01', '2025-06-15');
// { years: 1, months: 5, days: 14, hours: 0, minutes: 0, seconds: 0 }
```

## `ensureDate(date)`

Helper pour normaliser un `DateInput` (string ISO ou Date) en objet `Date` valide. Lance une erreur si la date est invalide.

```typescript
ensureDate('2025-01-01');       // Date object
ensureDate(new Date());         // Date object (passé tel quel)
ensureDate('invalid');          // Error: Invalid date string: invalid
```

## Type `DateInput`

Les fonctions acceptent `Date | string` (chaîne ISO).
