/**
 * Interfaces et Types TypeScript
 * Définit la structure des données et les types de l'application
 */

// Types possibles pour le style de l'alerte (correspond aux classes CSS : alert-danger, etc.)
type AlertType = 'danger' | 'warning' | 'info' | 'success';

// Interface pour les options de configuration de la classe Alert
interface AlertOptions {
  message: string;
  type: AlertType;
  dismissible?: boolean; // Indique si l'alerte a un bouton de fermeture
  duration?: number; // Durée avant fermeture automatique (en ms, si non dismissible)
}

interface ToastOptions {
  duration?: number;
  containerId?: string;
  autoRemove?: boolean;
  dismissible?: boolean;
}

type ToastType = 'success' | 'error' | 'info' | 'warning';

export { AlertType, AlertOptions, ToastType, ToastOptions };
