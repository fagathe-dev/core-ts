/**
 * @description Inserts an element into the DOM at a specified position and parent.
 * @param {HTMLElement | string} element - The element to be inserted, can be an HTMLElement or a string of HTML.
 * @param {InsertPosition | null} position - The position where the element should be inserted. Defaults to "beforeend" if null.
 * @param {HTMLElement | null} parent - The parent element where the new element will be inserted. Defaults to document.body if null.
 *
 * @returns {void}
 */
const insertElementToDOM = (
  element: HTMLElement | string,
  position: InsertPosition | null,
  parent: HTMLElement | null,
): void => {
  if (position === null) {
    position = "beforeend";
  }

  if (parent === null) {
    parent = document.body;
  }

  if (typeof element === "string") {
    parent.insertAdjacentHTML(position, element);

    return;
  }

  parent.insertAdjacentElement(position, element);
  return;
};

export { insertElementToDOM };
