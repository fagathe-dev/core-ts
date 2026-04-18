> Agis en tant que développeur Senior spécialisé en TypeScript et Vitest. 
> 
> Voici un fichier utilitaire TypeScript tiré de ma librairie `core-ts`. Ton objectif est de générer le fichier de test unitaire correspondant en utilisant **Vitest**.
> 
> **Règles strictes :**
> 1. **Colocation :** Le code généré est destiné à être sauvegardé dans le même dossier, avec l'extension `.test.ts`.
> 2. **Imports :** Importe toujours `describe, it, expect` (et `vi` si besoin de mock) depuis `vitest`. Importe les fonctions à tester via un import relatif direct.
> 3. **Exhaustivité :** Ne teste pas seulement le "happy path" (le cas où tout se passe bien). Ajoute des tests pour les cas limites (edge cases) : arguments nuls, indéfinis, chaînes vides, dates invalides, etc.
> 4. **Mocking :** Si le fichier utilise des dépendances externes (comme `axios` ou `fetch`), utilise `vi.mock()` pour simuler ces appels proprement sans faire de vraies requêtes réseau.
> 5. **Ignorer l'inutile :** Ne génère aucun test pour les simples déclarations de constantes ou les interfaces exportées.
> 6. **Format de sortie :** Renvoie uniquement le code complet du fichier `.test.ts` prêt à être copié-collé, sans blabla explicatif avant ou après.
> 
> Voici le code du fichier à tester :
> ```typescript
> [COLLE TON CODE ICI]
> ```