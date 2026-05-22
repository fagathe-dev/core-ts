/**
 * Enrichit un objet File brut (issu de la sérialisation Symfony) en FileProps complet
 * avec les champs calculés : iconClass, iconColor, formattedSize, uploadedBy.
 */
const FILE_ICON_MAP: Record<string, { icon: string; color: string }> = {
  pdf: { icon: 'ri-file-pdf-line', color: 'danger' },
  doc: { icon: 'ri-file-word-line', color: 'primary' },
  docx: { icon: 'ri-file-word-line', color: 'primary' },
  xls: { icon: 'ri-file-excel-line', color: 'success' },
  xlsx: { icon: 'ri-file-excel-line', color: 'success' },
  csv: { icon: 'ri-file-list-3-line', color: 'success' },
  ppt: { icon: 'ri-file-ppt-line', color: 'warning' },
  pptx: { icon: 'ri-file-ppt-line', color: 'warning' },
  jpg: { icon: 'ri-image-line', color: 'info' },
  jpeg: { icon: 'ri-image-line', color: 'info' },
  png: { icon: 'ri-image-line', color: 'info' },
  gif: { icon: 'ri-file-gif-line', color: 'info' },
  svg: { icon: 'ri-image-line', color: 'info' },
  webp: { icon: 'ri-image-line', color: 'info' },
  mp4: { icon: 'ri-video-line', color: 'purple' },
  avi: { icon: 'ri-video-line', color: 'purple' },
  mov: { icon: 'ri-video-line', color: 'purple' },
  mp3: { icon: 'ri-file-music-line', color: 'secondary' },
  wav: { icon: 'ri-file-music-line', color: 'secondary' },
  zip: { icon: 'ri-file-zip-line', color: 'dark' },
  rar: { icon: 'ri-file-zip-line', color: 'dark' },
  '7z': { icon: 'ri-file-zip-line', color: 'dark' },
  txt: { icon: 'ri-file-text-line', color: 'muted' },
  json: { icon: 'ri-file-code-line', color: 'primary' },
  js: { icon: 'ri-file-code-line', color: 'warning' },
  ts: { icon: 'ri-file-code-line', color: 'primary' },
  html: { icon: 'ri-html5-line', color: 'danger' },
  css: { icon: 'ri-css3-line', color: 'info' },
  php: { icon: 'ri-file-code-line', color: 'purple' },
};

// Icône par défaut pour les extensions non reconnues
const DEFAULT_ICON = { icon: 'ri-file-line', color: 'muted' };

const mapFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return FILE_ICON_MAP[ext] || DEFAULT_ICON;
};

export { FILE_ICON_MAP, DEFAULT_ICON, mapFileIcon };
