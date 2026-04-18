import { StorageStrategy } from '@/types/index.d';

/**
 * Service utilitaire pour encapsuler l'utilisation du localStorage et sessionStorage.
 * Il gère la sérialisation/désérialisation JSON et les erreurs de quota.
 */
class StorageService {
  // Utilise une implémentation par défaut qui est window.localStorage
  private storage: StorageStrategy;
  private readonly isAvailable: boolean;

  /**
   * Initialise le service.
   * @param storageStrategy La stratégie de stockage à utiliser (localStorage ou sessionStorage).
   */
  constructor(storageStrategy: 'local' | 'session' = 'local') {
    // Détermine la stratégie
    this.storage =
      storageStrategy === 'session'
        ? window.sessionStorage
        : window.localStorage;

    // Vérifie si le stockage est disponible (important en mode privé/incognito)
    this.isAvailable = this.checkStorageAvailability(this.storage);

    if (!this.isAvailable) {
      console.warn(
        `Le stockage (${storageStrategy}) n'est pas disponible dans cet environnement.`,
      );
    }
  }

  /**
   * Tente de lire une valeur stockée et la désérialise en JSON si possible.
   *
   * @param key La clé de stockage.
   * @returns La valeur désérialisée (objet, chaîne, nombre, booléen) ou null.
   */
  public get(key: string): unknown | null {
    if (!this.isAvailable) {
      return null;
    }

    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return null;
      }
      // Tente de parser le JSON. Si ce n'est pas du JSON, retourne la chaîne brute.
      try {
        return JSON.parse(item);
      } catch {
        return item; // Retourne la chaîne si ce n'était pas un objet JSON
      }
    } catch (error) {
      console.error(`Erreur de lecture de la clé "${key}" :`, error);
      return null;
    }
  }

  /**
   * Stocke une valeur. Sérialise les objets et les tableaux en JSON.
   *
   * @param key La clé de stockage.
   * @param value La valeur à stocker.
   * @returns True si l'opération a réussi, False sinon.
   */
  public set(key: string, value: unknown): boolean {
    if (!this.isAvailable) {
      return false;
    }

    let serializedValue: string;

    try {
      // Sérialisation des objets/tableaux ou conversion en chaîne pour les autres types
      if (typeof value === 'object' && value !== null) {
        serializedValue = JSON.stringify(value);
      } else if (typeof value === 'undefined') {
        // Ne rien stocker si la valeur est undefined
        return true;
      } else {
        serializedValue = String(value);
      }
    } catch (error) {
      console.error(`Erreur de sérialisation pour la clé "${key}" :`, error);
      return false;
    }

    try {
      this.storage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      // Gérer les erreurs spécifiques au stockage (ex: quota dépassé)
      if (
        error instanceof DOMException &&
        (error.code === 22 || // Firefox
          error.code === 1014 || // iOS
          error.name === 'QuotaExceededError')
      ) {
        console.error(
          `Erreur : Quota de stockage dépassé pour la clé "${key}".`,
        );
      } else {
        console.error(`Erreur de sauvegarde de la clé "${key}" :`, error);
      }
      return false;
    }
  }

  /**
   * Supprime un élément du stockage.
   * @param key La clé de l'élément à supprimer.
   */
  public remove(key: string): void {
    if (this.isAvailable) {
      this.storage.removeItem(key);
    }
  }

  /**
   * Vide tout le stockage. **À utiliser avec précaution.**
   */
  public clear(): void {
    if (this.isAvailable) {
      this.storage.clear();
    }
  }

  /**
   * Vérifie si l'API de stockage est accessible.
   */
  private checkStorageAvailability(storage: StorageStrategy): boolean {
    const testKey = '__test_storage_key__';
    try {
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      console.error(e);
      // Un échec de setItem indique généralement que l'accès est bloqué.
      return false;
    }
  }
}

export { StorageService };
