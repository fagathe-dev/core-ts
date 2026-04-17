/**
 * Utilitaires pour la gestion du presse-papier
 */

import { createElement } from '@/utils';
import { ClipboardOptions, ClipboardResult } from '@/types/index.d';

/**
 * Copie du texte dans le presse-papier
 * @param text - Texte à copier
 * @param options - Options de configuration
 * @returns Promise<ClipboardResult>
 */
const copyToClipboard = async (
  text: string,
  options: ClipboardOptions = {},
): Promise<ClipboardResult> => {
  const {
    showFeedback = true,
    feedbackDuration = 2000,
    successMessage = 'Copié !',
    errorMessage = 'Erreur lors de la copie',
  } = options;

  try {
    // Vérifier si l'API Clipboard est disponible
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback pour les navigateurs plus anciens ou contextes non sécurisés
      await fallbackCopyToClipboard(text);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};

/**
 * Méthode de fallback pour la copie
 * @param text - Texte à copier
 */
const fallbackCopyToClipboard = async (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Créer un élément textarea temporaire
    const textArea = createElement('textarea') as HTMLTextAreaElement;
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        resolve();
      } else {
        reject(new Error('La commande de copie a échoué'));
      }
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  });
};

/**
 * Gère la copie avec feedback visuel sur un bouton
 * @param button - Élément bouton
 * @param text - Texte à copier
 * @param options - Options de configuration
 */
const copyWithButtonFeedback = async (
  button: HTMLElement,
  text: string,
  options: ClipboardOptions = {},
): Promise<ClipboardResult> => {
  const {
    feedbackDuration = 2000,
    successMessage = 'Copié !',
    errorMessage = 'Erreur',
  } = options;

  // Sauvegarder l'état original du bouton
  const originalContent = button.innerHTML;
  const originalClasses = Array.from(button.classList);

  const result = await copyToClipboard(text, options);

  if (result.success) {
    // Feedback de succès
    button.innerHTML = `<i class="ds ds-tick me-1"></i>${successMessage}`;
    button.classList.remove('btn-outline-secondary');
    button.classList.add('btn-success');

    // Restaurer l'état original après le délai
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.className = originalClasses.join(' ');
    }, feedbackDuration);
  } else {
    // Feedback d'erreur
    button.innerHTML = `<i class="ds ds-cross-circle me-1"></i>${errorMessage}`;
    button.classList.remove('btn-outline-secondary');
    button.classList.add('btn-danger');

    // Restaurer l'état original après un délai plus court
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.className = originalClasses.join(' ');
    }, feedbackDuration / 2);
  }

  return result;
};

/**
 * Initialise les gestionnaires de copie pour tous les éléments avec data-copy-target
 */
const initClipboardHandlers = (): void => {
  const copyButtons =
    document.querySelectorAll<HTMLElement>('[data-copy-target]');

  copyButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();

      const targetId = button.getAttribute('data-copy-target');
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);
      if (!targetElement) {
        return;
      }

      // Extraire le texte du code
      const codeElement = targetElement.querySelector('code');
      const text = codeElement
        ? codeElement.textContent || codeElement.innerText
        : targetElement.textContent || targetElement.innerText;

      if (!text) {
        return;
      }

      // Copier avec feedback visuel
      await copyWithButtonFeedback(button, text, {
        successMessage: 'Copié !',
        errorMessage: 'Erreur',
        feedbackDuration: 2000,
      });
    });
  });
};

/**
 * Copie le contenu d'un élément par son ID
 * @param elementId - ID de l'élément contenant le texte à copier
 * @param options - Options de configuration
 */
const copyElementContent = async (
  elementId: string,
  options: ClipboardOptions = {},
): Promise<ClipboardResult> => {
  const element = document.getElementById(elementId);

  if (!element) {
    return {
      success: false,
      error: `Élément non trouvé: ${elementId}`,
    };
  }

  const text = element.textContent || element.innerText || '';
  return copyToClipboard(text, options);
};

/**
 * Vérifie si l'API Clipboard est disponible
 */
const isClipboardSupported = (): boolean => {
  return (
    !!(navigator.clipboard && window.isSecureContext) ||
    document.queryCommandSupported?.('copy') ||
    false
  );
};

export {
  copyToClipboard,
  copyWithButtonFeedback,
  initClipboardHandlers,
  copyElementContent,
  isClipboardSupported,
};
