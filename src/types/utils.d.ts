/**
 * Interface pour les paramètres de route, supportant des valeurs simples.
 */
type RouteParams = Record<string, string | number | boolean>;

/**
 * Interface définissant les méthodes pour interagir avec le stockage (Local ou Session).
 */
interface StorageStrategy {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}
interface DateModifierOptions {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
}

interface DateDiff {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Utilitaires pour la gestion du presse-papier
 */

interface ClipboardOptions {
  showFeedback?: boolean;
  feedbackDuration?: number;
  successMessage?: string;
  errorMessage?: string;
}

interface ClipboardResult {
  success: boolean;
  error?: string;
}

type DateInput = string | Date;

/**
 * Interface for API error data
 */
interface ApiErrorData {
  message: string;
  errors?: Record<string, string | string[]>;
  [key: string]: any;
}

/**
 * Interface representing the structure of API responses
 * @template T The type of data expected in the response
 */
interface FetchResponse<T> {
  ok: boolean;
  headers: Headers;
  status: number;
  statusText: string;
  data: T;
  text: string;
  blob: Blob;
}

/**
 * Interface for request options
 */
interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  timeout?: number;
  retries?: number;
}

// Types pour les éléments DOM et sélecteurs
type DOMSelector = string;
type HTMLElementWithId = HTMLElement & { id: string };

// Types pour les gestionnaires d'événements
type EventHandler = (event: Event) => void;
type ClickHandler = (event: MouseEvent) => void;
type ResizeHandler = (event: UIEvent) => void;

// --- TYPES ---

type TagNameType =
  | 'div'
  | 'p'
  | 'span'
  | 'section'
  | 'article'
  | 'header'
  | 'footer'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'ul'
  | 'ol'
  | 'li'
  | 'a'
  | 'button'
  | 'input'
  | 'img'
  | 'form'
  | 'label'
  | 'select'
  | 'option'
  | 'i'
  | 'textarea'
  | 'iframe'
  | 'nav'
  | 'main'
  | 'aside'
  | 'table'
  | 'thead'
  | 'tbody'
  | 'tr'
  | 'td'
  | 'th';

// Valeur : string, nombre (sera converti), booléen (pour l'activation)
type AttributeValue = string | number | boolean;

// Le Record accepte n'importe quelle clé string (donc 'class', 'href', mais aussi 'data-id')
type AttributeMap = Record<string, AttributeValue>;

interface FormType {
  form: HTMLFormElement;
  initialData?: FormDataType;
}

type FormDataType = Record<
  string,
  string | boolean | number | null | Array<string | boolean | number | null>
>;

interface ClipboardOptions {
  showFeedback?: boolean;
  feedbackDuration?: number;
  successMessage?: string;
  errorMessage?: string;
}

interface ClipboardResult {
  success: boolean;
  error?: string;
}

interface SelectableOptions {
  mode: 'radio' | 'nullable';
  onSelect?: (value: string | null) => void;
}

export type {
  DOMSelector,
  HTMLElementWithId,
  EventHandler,
  ClickHandler,
  ResizeHandler,
  TagNameType,
  AttributeValue,
  AttributeMap,
  RouteParams,
  StorageStrategy,
  DateModifierOptions,
  DateDiff,
  DateInput,
  ClipboardOptions,
  ClipboardResult,
  ApiErrorData,
  FetchResponse,
  RequestOptions,
  FormType,
  FormDataType,
  SelectableOptions,
};
