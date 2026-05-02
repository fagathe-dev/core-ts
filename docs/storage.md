# Storage (Stockage navigateur)

Utilitaires pour gérer les cookies et le localStorage/sessionStorage.

## Import

```typescript
import { CookieHelper } from '@/utils/storage/cookies';
import { StorageService } from '@/utils/storage/storage';
```

## CookieHelper

Classe statique pour lire, définir et supprimer les cookies côté client.

### `CookieHelper.get(key, defaultValue?)`

Récupère la valeur d'un cookie.

```typescript
CookieHelper.get('theme');          // 'dark' ou null
CookieHelper.get('theme', 'light'); // 'dark' ou 'light' (valeur par défaut)
```

### `CookieHelper.getAll()`

Retourne tous les cookies sous forme d'objet.

```typescript
const cookies = CookieHelper.getAll();
// { theme: 'dark', lang: 'fr', ... }
```

### `CookieHelper.set(key, value, expireDays?)`

Crée ou met à jour un cookie.

```typescript
CookieHelper.set('theme', 'dark');       // Expire dans 365 jours (défaut)
CookieHelper.set('session', 'abc', 7);   // Expire dans 7 jours
```

Options automatiques : `path=/`, `SameSite=Lax`, `Secure` (si HTTPS).

### `CookieHelper.delete(key)`

Supprime un cookie.

```typescript
CookieHelper.delete('theme');
```

### `CookieHelper.has(key)`

Vérifie l'existence d'un cookie.

```typescript
if (CookieHelper.has('auth_token')) {
  // Utilisateur connecté
}
```

### `CookieHelper.clear()`

Supprime tous les cookies du domaine/chemin actuel.

```typescript
CookieHelper.clear();
```

## StorageService

Service pour encapsuler localStorage et sessionStorage avec sérialisation JSON automatique et gestion du quota.

### Initialisation

```typescript
const localStorage = new StorageService('local');    // localStorage (défaut)
const sessionStorage = new StorageService('session'); // sessionStorage
```

### `storage.get(key)`

Lit et désérialise automatiquement une valeur.

```typescript
localStorage.get('user');    // { name: 'John', age: 30 } (objet JSON)
localStorage.get('count');   // 42 (number)
localStorage.get('missing'); // null
```

### `storage.set(key, value)`

Stocke une valeur (sérialisation automatique des objets).

```typescript
localStorage.set('user', { name: 'John', age: 30 }); // true
localStorage.set('count', 42);                         // true
localStorage.set('name', 'Alice');                     // true
```

Retourne `false` si le quota est dépassé ou si le stockage n'est pas disponible.

### `storage.remove(key)`

Supprime un élément.

```typescript
localStorage.remove('user');
```

### `storage.clear()`

Vide tout le stockage.

```typescript
localStorage.clear();
```

## Notes

- Le `StorageService` vérifie la disponibilité du stockage à l'initialisation (mode incognito, etc.)
- La sérialisation JSON est automatique : les objets sont stringifiés au set et parsés au get
- Si la valeur stockée n'est pas du JSON valide, la chaîne brute est retournée
