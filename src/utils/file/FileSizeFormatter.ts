/**
 * Classe utilitaire pour manipuler les tailles de fichiers (Formatage et Parsing).
 */
export class FileSizeFormatter {
  /**
   * Convertit la taille d'un fichier en octets vers un format plus lisible (octets, Ko, Mo, Go).
   * @param {number | null | undefined} filesize La taille du fichier en octets.
   * @param {number} precision Le nombre de décimales maximum (défaut: 2).
   */
  static format(
    filesize: number | null | undefined,
    precision: number = 2,
  ): string {
    if (filesize === 0 || filesize === null || filesize === undefined) {
      return '0 octets';
    }

    const units = ['octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];
    let power =
      filesize > 0 ? Math.floor(Math.log(filesize) / Math.log(1024)) : 0;
    power = Math.min(power, units.length - 1);
    const size = filesize / Math.pow(1024, power);

    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
    }).format(size);

    return `${formatted} ${units[power]}`;
  }

  /**
   * Convertit une chaîne de configuration (ex: "10M", "500K") en nombre d'octets.
   * @param sizeString La chaîne représentant la taille (ex: "10M").
   */
  static parse(sizeString: string): number {
    if (!sizeString) return 0;

    // On nettoie la chaîne (enlève espaces) et on met en majuscule
    const normalized = sizeString.trim().toUpperCase();

    // On récupère l'unité (la dernière lettre généralement K, M, G)
    // On gère le cas où l'utilisateur écrit "MB" ou "MO" en prenant juste la première lettre de l'unité
    const unitMatch = normalized.match(/[A-Z]+/);
    const unit = unitMatch ? unitMatch[0].charAt(0) : '';

    const value = parseFloat(normalized);

    if (isNaN(value))
      throw new Error(
        `FileSizeFormatter: Format de taille invalide "${sizeString}"`,
      );

    switch (unit) {
      case 'K':
        return value * 1024;
      case 'M':
        return value * 1024 * 1024;
      case 'G':
        return value * 1024 * 1024 * 1024;
      case 'T':
        return value * 1024 * 1024 * 1024 * 1024;
      default:
        return value; // Pas d'unité = octets
    }
  }

  /**
   * Vérifie si une taille respecte la limite.
   * @param currentSize La taille du fichier en octets.
   * @param maxSizeString La limite sous forme de chaîne (ex: "10M").
   */
  static isValid(currentSize: number, maxSizeString: string): boolean {
    return currentSize <= FileSizeFormatter.parse(maxSizeString);
  }
}
