import { marked, MarkedExtension, Token, Tokens } from 'marked';

// 1. On définit l'interface de notre Token personnalisé pour TypeScript
interface HighlightToken extends Tokens.Generic {
  type: 'highlight';
  raw: string;
  text: string;
  tokens: Token[];
}

/**
 * Extension Marked pour ajouter le support du surlignage (Highlight)
 * Convertit `==texte==` -> `<mark>texte</mark>`
 */
export const highlightExtension: MarkedExtension = {
  extensions: [
    {
      name: 'highlight',
      level: 'inline',
      
      start(src: string) {
        // Indique à marked où commence potentiellement le prochain token
        return src.indexOf('==');
      },

      tokenizer(src: string): HighlightToken | undefined {
        // Regex non-greedy pour capturer tout jusqu'au prochain ==
        // Cela permet d'avoir des '=' à l'intérieur du surlignage (ex: ==a=b==)
        const rule = /^==(.+?)==/;
        const match = rule.exec(src);

        if (match) {
          const text = match[1]; // Pas de trim() forcé ici pour respecter les espaces markdown, mais possible si souhaité

          return {
            type: 'highlight',
            raw: match[0],   // La chaîne complète : ==texte==
            text,            // Le contenu : texte
            // Analyse récursive du contenu (permet le gras/italique à l'intérieur)
            tokens: this.lexer.inlineTokens(text),
          };
        }
        return undefined; // Retourner undefined ou false indique qu'il n'y a pas de match
      },

      renderer(token) {
        // On cast le token générique vers notre interface pour accéder à .tokens proprement
        const highlightToken = token as HighlightToken;
        
        return `<mark>${this.parser.parseInline(highlightToken.tokens)}</mark>`;
      },
    },
  ],
};

// 2. IMPORTANT : On charge l'extension UNE SEULE FOIS au chargement du module
marked.use(highlightExtension);

/**
 * Convertit une chaîne de caractères Markdown en HTML.
 * @param markdownText Le texte source au format Markdown.
 * @returns Le texte converti au format HTML.
 */
export const convertMarkdownToHtml = (markdownText: string): string => {
  if (!markdownText) {
    return '';
  }

  // 3. On force async: false pour garantir le retour d'une string (et non une Promise)
  // et on gère proprement les sauts de ligne avec gfm: true (recommandé)
  const html = marked.parse(markdownText, { async: false, gfm: true });
  
  return html as string;
};