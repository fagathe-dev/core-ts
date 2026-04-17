/**
 * Point d'entrée TS pour la page d'affichage d'un Espace.
 * Orchestre les composants spécifiques à la page (Capsule, Tabs, Paramètres, Vue Espace).
 */

import { SpaceViewManager, CapsuleAuthManager, SpaceSettingsManager } from '@/managers';

// Le module MDB est chargé globalement via le layout Twig
declare const mdb: any;

document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les inputs dynamiques MDB (animation des labels flottants)
  document.querySelectorAll('.form-outline').forEach((formOutline) => {
    if (typeof mdb !== 'undefined' && mdb.Input) {
      new mdb.Input(formOutline).init();
    }
  });

  const rootEl = document.getElementById('space-interactive-root');
  if (!rootEl) return;

  // 1. Récupération du contexte injecté par le AppController (PHP / Twig)
  const rawContext = rootEl.getAttribute('data-context');
  const context = JSON.parse(rawContext || '{}');
  const spaceId = parseInt(rootEl.getAttribute('data-space-id') || '0', 10);

  if (!spaceId) {
    console.error("Identifiant de l'espace introuvable dans le DOM.");
    return;
  }

  // 2. Initialiser le manager des paramètres si l'utilisateur est propriétaire
  if (context.isOwner) {
    // Gère la mise à jour (Nom, Description, Couleur) et le Hard Delete
    new SpaceSettingsManager(spaceId, context.spaceName);
  }

  // 3. Logique Conditionnelle : Espace Standard vs Capsule Privée
  if (context.isCapsule) {
    // Initialise la logique d'authentification (sessionStorage, form submit)
    new CapsuleAuthManager(spaceId);

    // On écoute l'événement de déverrouillage envoyé par le CapsuleAuthManager
    document.addEventListener('capsuleUnlocked', () => {
      console.log('🔓 Capsule déverrouillée, lancement du chargement des modules...');

      // On lance le manager principal (onglets, hydratation SSR, actions)
      new SpaceViewManager(rootEl);

      // On affiche le FAB contextuel qui était caché par sécurité
      const fab = document.getElementById('contextual-fab');
      if (fab) fab.classList.remove('d-none');
    });
  } else {
    // C'est un espace public/standard, on charge tout immédiatement
    new SpaceViewManager(rootEl);
  }
});