/**
 * Enrichit un objet File brut (issu de la sérialisation Symfony) en FileProps complet
 * avec les champs calculés : iconClass, iconColor, formattedSize, uploadedBy.
 */

// TODO: - Revoir le mapping des extensions vers les icônes par rapport au changement de lib d'icônes (FontAwesome 5 -> remix ou autres icônes dispo avec le thème Velzon) et à l'ajout de nouvelles extensions (csv, webp, etc.)
const FILE_ICON_MAP: Record<string, { icon: string; color: string }> = {
  pdf: { icon: 'fas fa-file-pdf', color: 'danger' },
  doc: { icon: 'fas fa-file-word', color: 'primary' },
  docx: { icon: 'fas fa-file-word', color: 'primary' },
  xls: { icon: 'fas fa-file-excel', color: 'success' },
  xlsx: { icon: 'fas fa-file-excel', color: 'success' },
  csv: { icon: 'fas fa-file-csv', color: 'success' },
  ppt: { icon: 'fas fa-file-powerpoint', color: 'warning' },
  pptx: { icon: 'fas fa-file-powerpoint', color: 'warning' },
  jpg: { icon: 'fas fa-file-image', color: 'info' },
  jpeg: { icon: 'fas fa-file-image', color: 'info' },
  png: { icon: 'fas fa-file-image', color: 'info' },
  gif: { icon: 'fas fa-file-image', color: 'info' },
  svg: { icon: 'fas fa-file-image', color: 'info' },
  webp: { icon: 'fas fa-file-image', color: 'info' },
  mp4: { icon: 'fas fa-file-video', color: 'purple' },
  avi: { icon: 'fas fa-file-video', color: 'purple' },
  mov: { icon: 'fas fa-file-video', color: 'purple' },
  mp3: { icon: 'fas fa-file-audio', color: 'secondary' },
  wav: { icon: 'fas fa-file-audio', color: 'secondary' },
  zip: { icon: 'fas fa-file-archive', color: 'dark' },
  rar: { icon: 'fas fa-file-archive', color: 'dark' },
  '7z': { icon: 'fas fa-file-archive', color: 'dark' },
  txt: { icon: 'fas fa-file-alt', color: 'muted' },
  json: { icon: 'fas fa-file-code', color: 'primary' },
  js: { icon: 'fas fa-file-code', color: 'warning' },
  ts: { icon: 'fas fa-file-code', color: 'primary' },
  html: { icon: 'fas fa-file-code', color: 'danger' },
  css: { icon: 'fas fa-file-code', color: 'info' },
  php: { icon: 'fas fa-file-code', color: 'purple' },
};

const DEFAULT_ICON = { icon: 'fas fa-file', color: 'muted' };

export { FILE_ICON_MAP, DEFAULT_ICON };
