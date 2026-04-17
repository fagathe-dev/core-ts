import { fetchPOST } from '@/utils/request/fetch';
import { ROUTES } from '@/constants/routes';
import { router } from '@/utils/request/router';

export class CapsuleAuthManager {
  private spaceId: number;
  private rootEl: HTMLElement | null;
  private lockScreenEl: HTMLElement | null;

  constructor(spaceId: number) {
    this.spaceId = spaceId;
    this.rootEl = document.getElementById('space-interactive-root');
    this.lockScreenEl = document.getElementById('capsule-lock-screen');

    this.init();
  }

  private init() {
    if (!this.rootEl || !this.lockScreenEl) return;

    // Vérifie si la session de navigation a déjà déverrouillé cette capsule
    const isUnlocked = sessionStorage.getItem(
      `capsule_unlocked_${this.spaceId}`,
    );

    if (isUnlocked) {
      this.unlockUI();
    } else {
      this.bindEvents();
    }
  }

  private bindEvents() {
    const form = document.getElementById(
      'capsule-unlock-form',
    ) as HTMLFormElement;
    const input = document.getElementById(
      'capsule-passphrase',
    ) as HTMLInputElement;

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button') as HTMLButtonElement;
      const originalText = btn.innerHTML;

      try {
        btn.innerHTML =
          '<span class="spinner-border spinner-border-sm"></span>';
        btn.disabled = true;
        input.classList.remove('is-invalid');

        // Appel AJAX à l'endpoint dédié de vérification capsule
        const url = router(ROUTES.AJX.CAPSULE.VERIFY, { id: this.spaceId });
        await fetchPOST(url, { passphrase: input.value });

        // En cas de succès 200, on enregistre dans sessionStorage
        sessionStorage.setItem(`capsule_unlocked_${this.spaceId}`, 'true');
        this.unlockUI();
      } catch (error) {
        input.classList.add('is-invalid');
        input.value = '';
        const feedback = form.querySelector('.invalid-feedback');
        if (feedback) feedback.textContent = 'Phrase secrète incorrecte.';
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  private unlockUI() {
    if (this.lockScreenEl) this.lockScreenEl.classList.add('d-none');
    if (this.rootEl) {
      this.rootEl.classList.remove('d-none');

      // On déclenche un événement Custom pour prévenir les autres modules (Todos, Drive)
      // qu'ils peuvent lancer leurs appels Fetch initiaux car l'UI est débloquée.
      const event = new CustomEvent('capsuleUnlocked', {
        detail: { spaceId: this.spaceId },
      });
      document.dispatchEvent(event);
    }
  }
}
