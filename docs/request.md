# Request (Requêtes HTTP)

Client HTTP basé sur Axios avec gestion d'erreurs typées, retry automatique et authentification par token.

## Import

```typescript
import { fetchAPI, getApiToken } from '@/utils/request/fetch';
import { ApiError } from '@/utils/request/api-error';
import { router } from '@/utils/request/router';
import { addQueryParams, removeQueryParams, getQueryParams, getCurrentUrl, getCurrentPath } from '@/utils/request/url';
import { HTTP_STATUS } from '@/utils/request/http-status';
```

## `fetchAPI<T>(url, options?)`

Fonction principale pour effectuer des requêtes API.

### Requête GET simple

```typescript
const response = await fetchAPI<User[]>('/api/users');
console.log(response.data); // User[]
```

### Requête POST avec body

```typescript
const response = await fetchAPI<User>('/api/users', {
  method: 'POST',
  body: { name: 'John', email: 'john@example.com' },
});
```

Le body est automatiquement sérialisé en JSON si c'est un objet (sauf `FormData`, `Blob`, etc.).

### Requête authentifiée

```typescript
const response = await fetchAPI<Project>('/api/projects', {
  isAPIAuthenticated: true, // Ajoute le header X-AUTH-TOKEN depuis les cookies
});
```

### Upload de fichier avec progression

```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetchAPI('/api/upload', {
  method: 'POST',
  body: formData,
  onUploadProgress: (event) => {
    const percent = Math.round((event.loaded * 100) / event.total);
    console.log(`${percent}%`);
  },
});
```

### Options

| Option                | Type       | Défaut            | Description                          |
|-----------------------|------------|-------------------|--------------------------------------|
| `timeout`             | `number`   | config par défaut | Timeout en ms                        |
| `retries`             | `number`   | config par défaut | Nombre de tentatives                 |
| `isAPIAuthenticated`  | `boolean`  | `false`           | Ajoute le token API dans les headers |
| `onUploadProgress`    | `function` | —                 | Callback de progression upload       |
| `onDownloadProgress`  | `function` | —                 | Callback de progression download     |
| `responseType`        | `string`   | `'json'`          | Type de réponse attendu              |

### Réponse (`FetchResponse<T>`)

```typescript
interface FetchResponse<T> {
  ok: boolean;
  headers: Headers;
  status: number;
  statusText: string;
  data: T;
  text: string;
  blob: Blob;
}
```

## `ApiError`

Classe d'erreur typée lancée quand une requête retourne un statut non-2xx.

```typescript
try {
  await fetchAPI('/api/resource');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status);        // 404
    console.log(error.isClientError()); // true
    console.log(error.isServerError()); // false
    console.log(error.getErrorMessage());
    console.log(error.getValidationErrors()); // { field: 'message' } ou null
  }
}
```

### Méthodes utilitaires

| Méthode                  | Description                              |
|--------------------------|------------------------------------------|
| `isStatus(code)`         | Vérifie un code HTTP précis              |
| `isClientError()`        | Erreur 4xx                               |
| `isServerError()`        | Erreur 5xx                               |
| `isNetworkError()`       | Erreur réseau (status 0)                 |
| `getErrorMessage()`      | Message d'erreur depuis la réponse       |
| `getValidationErrors()`  | Erreurs de validation (objet ou null)    |

## `router(path, params?, absoluteUrl?)`

Génère une URL avec remplacement de paramètres de chemin et query string.

```typescript
router('/lists/{listId}/update', { listId: 42 });
// '/lists/42/update'

router('/posts', { page: 2, limit: 10 });
// '/posts?page=2&limit=10'

router('/users/{id}', { id: 5, tab: 'settings' });
// '/users/5?tab=settings'

router('/api/data', {}, true);
// 'https://domain.com/api/data' (URL absolue)
```

## Manipulation d'URL

### `addQueryParams(url, params)`

Ajoute ou met à jour des paramètres de requête.

```typescript
addQueryParams('/posts?limit=10', { page: 2 });
// '/posts?limit=10&page=2'

addQueryParams('/posts?page=1', { page: 3 });
// '/posts?page=3'
```

### `removeQueryParams(url, keys)`

Supprime des paramètres de requête.

```typescript
removeQueryParams('/posts?page=2&limit=10', ['page']);
// '/posts?limit=10'
```

### `getQueryParams(url)`

Extrait tous les paramètres de requête sous forme d'objet.

```typescript
getQueryParams('/posts?page=2&limit=10');
// { page: '2', limit: '10' }
```

### `getCurrentUrl()` / `getCurrentPath()`

```typescript
getCurrentUrl();  // 'https://example.com/posts?page=2'
getCurrentPath(); // '/posts'
```

## `HTTP_STATUS`

Constantes pour les codes HTTP courants.

```typescript
HTTP_STATUS.OK;                  // 200
HTTP_STATUS.CREATED;             // 201
HTTP_STATUS.NO_CONTENT;          // 204
HTTP_STATUS.BAD_REQUEST;         // 400
HTTP_STATUS.UNAUTHORIZED;        // 401
HTTP_STATUS.FORBIDDEN;           // 403
HTTP_STATUS.NOT_FOUND;           // 404
HTTP_STATUS.INTERNAL_SERVER_ERROR; // 500
```
