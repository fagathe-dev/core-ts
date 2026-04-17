import { FileCategory, FileTypeDefinition } from '@/types/index.d';

// Configuration immuable des types de fichiers
export const FILE_TYPES_CONFIG: Record<FileCategory, FileTypeDefinition> = {
  ARCHIVE: {
    type: 'Archive',
    extensions: ['zip', 'rar', '7z', 'tar', 'gz'],
    mimeTypes: [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
    ],
  },
  AUDIO: {
    extensions: ['mp3', 'wav', 'ogg', 'weba'],
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
  },
  CODE: {
    type: 'Code Source',
    extensions: [
      'html',
      'css',
      'js',
      'json',
      'ts',
      'php',
      'py',
      'java',
      'c',
      'cpp',
    ],
    mimeTypes: [
      'text/html',
      'text/css',
      'text/javascript',
      'application/json',
      'text/x-php',
    ],
  },
  DOCUMENT: {
    type: 'Document',
    extensions: ['doc', 'docx'],
    mimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  IMAGE: {
    type: 'Image',
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ],
  },
  PDF: {
    type: 'PDF',
    extensions: ['pdf'],
    mimeTypes: ['application/pdf'],
  },
  PRESENTATION: {
    extensions: ['ppt', 'pptx'],
    mimeTypes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
  },
  SPREADSHEET: {
    type: 'Feuille de calcul',
    extensions: ['xls', 'xlsx', 'csv'],
    mimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ],
  },
  TEXT: {
    type: 'Texte',
    extensions: ['txt', 'md', 'csv'],
    mimeTypes: ['text/plain', 'text/markdown', 'text/csv'],
  },
  VIDEO: {
    type: 'Vidéo',
    extensions: ['mp4', 'webm', 'ogg', 'mov', 'avi'],
    mimeTypes: [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/x-msvideo',
    ],
  },
} as const;
