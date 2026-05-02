# Drag & Drop

Utilitaire agnostique pour le Drag & Drop natif HTML5, utilisant la délégation d'événements sur un conteneur principal.

## Import

```typescript
import { DragNDrop } from 'core-ts';
```

## Utilisation

```typescript
const dnd = new DragNDrop({
  container: '#file-list',           // Sélecteur ou HTMLElement du conteneur
  itemSelector: '.file-row',         // Éléments que l'on peut glisser
  dropTargetSelector: '.folder-row', // Zones de dépôt (optionnel)
  onDragStart: (event, draggedElement) => {
    console.log('Début du drag', draggedElement);
  },
  onDrop: (event, draggedElement, targetElement) => {
    console.log('Déposé sur', targetElement);
    // Logique métier : déplacer un fichier dans un dossier, etc.
  },
  onDragEnd: (event, draggedElement) => {
    console.log('Fin du drag');
  },
  onAbort: (event, draggedElement) => {
    console.log('Drag annulé (pas de drop valide)');
  },
});
```

## Options (`DragNDropOptions`)

| Option               | Type                        | Requis | Description                                         |
|----------------------|-----------------------------|--------|-----------------------------------------------------|
| `container`          | `string \| HTMLElement`     | ✅     | Conteneur principal (délégation d'événements)       |
| `itemSelector`       | `string`                    | ✅     | Sélecteur CSS des éléments draggables               |
| `dropTargetSelector` | `string`                    | ❌     | Sélecteur des zones de dépôt (défaut: `itemSelector`) |
| `onDragStart`        | `(event, element) => void`  | ❌     | Callback au début du drag                           |
| `onDragEnd`          | `(event, element) => void`  | ❌     | Callback à la fin du drag                           |
| `onDrop`             | `(event, dragged, target) => void` | ❌ | Callback lors du dépôt réussi                    |
| `onAbort`            | `(event, element) => void`  | ❌     | Callback si le drag se termine sans dépôt valide    |

## Classes CSS ajoutées automatiquement

| Classe       | Appliquée sur         | Moment                         |
|--------------|-----------------------|--------------------------------|
| `dragging`   | L'élément glissé      | Pendant le drag                |
| `drag-over`  | La zone de dépôt      | Quand un élément survole la zone |

## Notes

- Les éléments draggables doivent avoir l'attribut `draggable="true"` dans le HTML.
- La classe utilise la délégation d'événements : un seul listener sur le conteneur.
- Le drop n'est pas autorisé sur l'élément glissé lui-même.
- Compatible Firefox (gestion du `dataTransfer` requise).
