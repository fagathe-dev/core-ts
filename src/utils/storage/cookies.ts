/**
 * Interface pour représenter l'objet associatif des cookies.
 */
interface CookieMap {
  [key: string]: string;
}

/**
 * Classe utilitaire complète pour lire, définir et supprimer les cookies côté client.
 * Elle gère l'encodage et le décodage des noms et valeurs.
 */
export class CookieHelper {
  /**
   * Récupère tous les cookies sous forme d'objet associatif.
   *
   * @returns Un objet où les clés sont les noms des cookies et les valeurs sont leurs valeurs.
   */
  public static getAll(): CookieMap {
    const cookies: CookieMap = {};

    // document.cookie est une chaîne de la forme "key1=value1; key2=value2;..."
    if (document.cookie === '') {
      return cookies;
    }

    const ca = document.cookie.split(';');

    for (const cookie of ca) {
      const c = cookie.trim();

      // Trouver la position du premier '='
      const eqIndex = c.indexOf('=');

      // Si un '=' est trouvé et n'est pas au début
      if (eqIndex > 0) {
        const key = decodeURIComponent(c.substring(0, eqIndex));
        const value = decodeURIComponent(c.substring(eqIndex + 1));
        cookies[key] = value;
      }
    }

    return cookies;
  }

  /**
   * Récupère la valeur d'un cookie spécifique par son nom.
   *
   * @param key Le nom du cookie à récupérer.
   * @param defaultValue La valeur à retourner si le cookie n'est pas trouvé.
   * @returns La valeur du cookie ou la valeur par défaut.
   */
  public static get(
    key: string,
    defaultValue: string | null = null
  ): string | null {
    // Correction: Assurez-vous que l'accès à la clé utilise le même mécanisme que getAll
    // getAll() retourne un objet dont les clés sont les noms des cookies.
    return this.getAll()[key] ?? defaultValue;
  }

  /**
   * Définit (crée ou met à jour) un cookie.
   *
   * @param key Le nom du cookie.
   * @param value La valeur du cookie.
   * @param expireDays Le nombre de jours avant l'expiration (par défaut 365).
   */
  public static set(
    key: string,
    value: string,
    expireDays: number = 365
  ): void {
    const date = new Date();
    date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();

    // Ajoute SameSite=Lax et Secure si HTTPS est utilisé
    const baseCookie = `${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/; SameSite=Lax`;

    // Ajoute 'Secure' uniquement si l'application est en HTTPS
    const securePart = window.location.protocol === 'https:' ? '; Secure' : '';

    document.cookie = baseCookie + securePart;
  }

  /**
   * Supprime un cookie en définissant sa date d'expiration dans le passé.
   *
   * @param key Le nom du cookie à supprimer.
   */
  public static delete(key: string): void {
    // Définir la date d'expiration pour l'effacer
    const date = new Date(0).toUTCString();
    // Path=/ est essentiel pour garantir que le bon cookie est supprimé
    document.cookie = `${encodeURIComponent(
      key
    )}=; expires=${date}; path=/; SameSite=Lax`;
  }

  /**
   * Vérifie l'existence d'un cookie basé sur la clé.
   *
   * @param key La clé du cookie à vérifier.
   * @returns True si le cookie existe, False sinon.
   */
  public static has(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.getAll(), key);
  }

  /**
   * Supprime tous les cookies du domaine/chemin actuel en les faisant expirer.
   */
  public static clear(): void {
    const cookies = this.getAll();
    for (const key in cookies) {
      // Utilise la méthode delete pour s'assurer que l'expiration est gérée correctement
      this.delete(key);
    }
  }
}
