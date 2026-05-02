# File (Gestion des fichiers)

Utilitaires pour le formatage de tailles de fichiers et le mapping d'icônes par extension.

## Import

```typescript
import { FileSizeFormatter } from '@/utils/file/FileSizeFormatter';
import { FILE_ICON_MAP, DEFAULT_ICON } from '@/utils/file/mapFileIcon';
```

## FileSizeFormatter

Classe utilitaire pour manipuler les tailles de fichiers.

### `FileSizeFormatter.format(filesize, precision?)`

Convertit une taille en octets vers un format lisible (Ko, Mo, Go...).

```typescript
FileSizeFormatter.format(0);           // '0 octets'
FileSizeFormatter.format(1024);        // '1 Ko'
FileSizeFormatter.format(1536);        // '1,5 Ko'
FileSizeFormatter.format(1048576);     // '1 Mo'
FileSizeFormatter.format(1073741824);  // '1 Go'
FileSizeFormatter.format(1536, 0);     // '2 Ko' (sans décimales)
```

### `FileSizeFormatter.parse(sizeString)`

Convertit une chaîne de configuration en nombre d'octets.

```typescript
FileSizeFormatter.parse('10M');   // 10485760
FileSizeFormatter.parse('500K');  // 512000
FileSizeFormatter.parse('2G');    // 2147483648
FileSizeFormatter.parse('1024');  // 1024 (pas d'unité = octets)
```

Formats supportés : `K` (Ko), `M` (Mo), `G` (Go), `T` (To).

### `FileSizeFormatter.isValid(currentSize, maxSizeString)`

Vérifie si une taille de fichier respecte une limite.

```typescript
FileSizeFormatter.isValid(5000000, '10M');  // true (5Mo < 10Mo)
FileSizeFormatter.isValid(15000000, '10M'); // false (15Mo > 10Mo)
```

## FileUploader

Classe générique pour l'upload de fichiers avec validation, preview et suivi de progression.

### Import

```typescript
import { FileUploader } from '@/utils/file/uploader';
```

### Initialisation

```typescript
const uploader = new FileUploader({
  uploadUrl: '/api/upload/avatar',
  inputElement: document.getElementById('file-input') as HTMLInputElement,
  fieldName: 'avatar',       // Nom du champ FormData (défaut: 'avatar')
  maxSize: '2M',             // Taille max (optionnel)
  allowedMimes: ['image/png', 'image/jpeg', 'image/webp'], // Types MIME autorisés (optionnel)
  onPreview: (base64Url) => {
    img.src = base64Url;
  },
  onProgress: (percent) => {
    progressBar.style.width = `${percent}%`;
  },
  onSuccess: (data) => {
    console.log('Upload réussi', data);
  },
  onError: (message) => {
    alert(message);
  },
});
```

### Configuration (`FileUploaderConfig`)

| Option         | Type                          | Requis | Description                                      |
|----------------|-------------------------------|--------|--------------------------------------------------|
| `uploadUrl`    | `string`                      | ✅     | URL de l'endpoint d'upload                       |
| `inputElement` | `HTMLInputElement`            | ✅     | Input file écouté                                |
| `fieldName`    | `string`                      | ❌     | Nom du champ dans le FormData (défaut: `'avatar'`) |
| `maxSize`      | `string`                      | ❌     | Taille max (ex: `'2M'`, `'500K'`)               |
| `allowedMimes` | `string[]`                    | ❌     | Types MIME autorisés                             |
| `onSuccess`    | `(data: unknown) => void`     | ❌     | Callback après upload réussi                     |
| `onError`      | `(error: string) => void`     | ❌     | Callback en cas d'erreur                         |
| `onProgress`   | `(percent: number) => void`   | ❌     | Callback de progression (0-100)                  |
| `onPreview`    | `(base64Url: string) => void` | ❌     | Callback avec la preview base64 (images uniquement) |

### Comportement

1. **Écoute** : l'événement `change` sur l'input déclenche automatiquement le processus.
2. **Validation** : vérifie la taille (`FileSizeFormatter.isValid`) et le type MIME avant tout envoi.
3. **Preview** : si le fichier est une image (`image/*`), génère une DataURL via `FileReader` et appelle `onPreview`.
4. **Upload** : envoie le fichier via `fetchAPI` (POST + FormData) avec suivi de progression.
5. **Erreurs** : les erreurs API sont extraites via `ApiError.getErrorMessage()`.

---

## Mapping d'icônes

`FILE_ICON_MAP` associe une extension de fichier à une icône FontAwesome et une couleur.

```typescript
import { FILE_ICON_MAP, DEFAULT_ICON } from '@/utils/file/mapFileIcon';

const extension = 'pdf';
const { icon, color } = FILE_ICON_MAP[extension] ?? DEFAULT_ICON;
// icon: 'fas fa-file-pdf', color: 'danger'
```

### Extensions supportées

| Catégorie    | Extensions                          | Couleur     |
|--------------|-------------------------------------|-------------|
| PDF          | `pdf`                               | `danger`    |
| Word         | `doc`, `docx`                       | `primary`   |
| Excel        | `xls`, `xlsx`, `csv`                | `success`   |
| PowerPoint   | `ppt`, `pptx`                       | `warning`   |
| Images       | `jpg`, `jpeg`, `png`, `gif`, `svg`, `webp` | `info` |
| Vidéo        | `mp4`, `avi`, `mov`                 | `purple`    |
| Audio        | `mp3`, `wav`                        | `secondary` |
| Archives     | `zip`, `rar`, `7z`                  | `dark`      |
| Texte        | `txt`                               | `muted`     |
| Code         | `json`, `js`, `ts`, `html`, `css`, `php` | variable |

### Icône par défaut

Si l'extension n'est pas mappée :

```typescript
DEFAULT_ICON // { icon: 'fas fa-file', color: 'muted' }
```
