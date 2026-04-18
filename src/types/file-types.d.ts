export type FileCategory =
  | 'VIDEO'
  | 'AUDIO'
  | 'IMAGE'
  | 'PDF'
  | 'ARCHIVE'
  | 'CODE'
  | 'DOCUMENT'
  | 'PRESENTATION'
  | 'SPREADSHEET'
  | 'TEXT';

export interface UploaderOptions {
  multiple?: boolean;
  allowedTypes?: FileCategory[] | '*'; // '*' pour tout accepter
  previewContainer?: string | HTMLElement; // Sélecteur ou Element direct
  enablePreview?: boolean;
  maxFileSize?: string; // ex: '10M'
  maxFiles?: number;
}

export interface FileTypeDefinition {
  type?: string;
  extensions: readonly string[];
  mimeTypes: readonly string[];
}
