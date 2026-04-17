import { UploaderOptions } from '@/types/index.d';

/**
 * Configuration globale par défaut pour le module Uploader.
 * Ces valeurs sont utilisées si aucune option spécifique n'est passée à l'instanciation.
 */
export const DEFAULT_UPLOADER_OPTIONS: UploaderOptions = {
  multiple: false,
  allowedTypes: '*', // Par défaut, on accepte tout
  enablePreview: true, // On active la prévisualisation par défaut
  previewContainer: undefined, // Sera généré automatiquement si non défini
  maxFileSize: '10M', // Taille max par défaut standard
  maxFiles: 1, // Upload unitaire par défaut
};
