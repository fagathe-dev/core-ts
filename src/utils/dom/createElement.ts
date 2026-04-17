import { AttributeMap } from "@/types/index.d";

const createElement = (
  tagName: keyof HTMLElementTagNameMap,
  classes?: string,
  id?: string,
  attributes?: AttributeMap
): HTMLElement => {
  const element = document.createElement(tagName);

  if (classes) element.className = classes;
  if (id) element.id = id;

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      // 1. Attributs booléens TRUE (ex: required, disabled, data-active)
      if (value === true) {
        element.setAttribute(key, '');
      }
      // 2. Valeurs standards (string/number)
      // On ignore false/null/undefined
      else if (value !== false && value != null) {
        element.setAttribute(key, String(value));
      }
    });
  }

  return element;
};

export { createElement };
