import { MarkedExtension } from 'marked';

/**
 * Configuration par défaut pour les requêtes
 */
declare const DEFAULT_FETCH_API_CONFIG: {
    timeout: number;
    retries: number;
    headers: {
        Accept: string;
        'Content-Type': string;
    };
};

type FileCategory =
  | 'VIDEO'
  | 'AUDIO'
  | 'IMAGE'
  | 'PDF'
  | 'ARCHIVE'
  | 'CODE'
  | 'DOCUMENT'
  | 'PRESENTATION'
  | 'SPREADSHEET'
  | 'TEXT';

interface UploaderOptions {
  multiple?: boolean;
  allowedTypes?: FileCategory[] | '*'; // '*' pour tout accepter
  previewContainer?: string | HTMLElement; // Sélecteur ou Element direct
  enablePreview?: boolean;
  maxFileSize?: string; // ex: '10M'
  maxFiles?: number;
}

interface FileTypeDefinition {
  type?: string;
  extensions: readonly string[];
  mimeTypes: readonly string[];
}

declare const FILE_TYPES_CONFIG: Record<FileCategory, FileTypeDefinition>;

declare const ANIMATION_DURATION: {
    readonly FAST: 150;
    readonly NORMAL: 300;
    readonly SLOW: 350;
};
declare const DEFAULT_DURATION = 10000;

// Types pour les breakpoints Bootstrap/Design System
type BreakPointType = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// Interface pour les objets de breakpoints
interface BreakPointsInterface {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

/**
 * Interface pour les paramètres de route, supportant des valeurs simples.
 */
type RouteParams$1 = Record<string, string | number | boolean>;

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

/**
 * Utilitaires pour la gestion du presse-papier
 */

interface ClipboardOptions {
  showFeedback?: boolean;
  feedbackDuration?: number;
  successMessage?: string;
  errorMessage?: string;
}

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

interface ClipboardResult {
  success: boolean;
  error?: string;
}

interface SelectableOptions {
  mode: 'radio' | 'nullable';
  onSelect?: (value: string | null) => void;
}

/**
 * Configuration globale par défaut pour le module Uploader.
 * Ces valeurs sont utilisées si aucune option spécifique n'est passée à l'instanciation.
 */
declare const DEFAULT_UPLOADER_OPTIONS: UploaderOptions;

declare const APP_WORKSPACE_DATA_SESSION_KEY = "__ffr_v.wsp.app_data";
declare const API_TOKEN_COOKIE_NAME = "__ffr_v.aoth.tkn";

declare const BREAKPOINTS: BreakPointsInterface;

declare const BASE_URL: string;

declare class DateCalculator {
    /**
     * Modifie une date en ajoutant/soustrayant des unités.
     * Retourne une NOUVELLE instance (Immutabilité).
     */
    static modify(date: DateInput, options: DateModifierOptions): Date;
    /**
     * Vérifie strictement si la date cible est dans le passé par rapport à maintenant.
     */
    static isPast(date: DateInput): boolean;
    /**
     * Vérifie si la date cible est dans le futur.
     */
    static isFuture(date: DateInput): boolean;
    /**
     * Calcule la différence détaillée entre deux dates.
     */
    static diff(date1: DateInput, date2?: DateInput): DateDiff;
}

declare class DateFormatter {
    static readonly LOCALE = "fr-FR";
    static readonly TIMEZONE = "Europe/Paris";
    /**
     * Format compact pour les listes : "2 déc. 15:00"
     */
    static todo(date: DateInput): string;
    /**
     * Format complet : "mercredi 2 avril 2025 à 23:29"
     */
    static full(date: DateInput): string;
    /**
     * Format court : "12/12/2023"
     */
    static short(date: DateInput): string;
    /**
     * Format relatif : "il y a 5 minutes", "à l'instant"
     */
    static ago(date: DateInput): string;
}

/**
 * Garantit qu'une valeur est bien un objet Date valide.
 * Accepte une instance de Date ou une chaîne ISO.
 */
declare function ensureDate(date: DateInput): Date;

declare const createElement: (tagName: keyof HTMLElementTagNameMap, classes?: string, id?: string, attributes?: AttributeMap) => HTMLElement;

/**
 * @description Inserts an element into the DOM at a specified position and parent.
 * @param {HTMLElement | string} element - The element to be inserted, can be an HTMLElement or a string of HTML.
 * @param {InsertPosition | null} position - The position where the element should be inserted. Defaults to "beforeend" if null.
 * @param {HTMLElement | null} parent - The parent element where the new element will be inserted. Defaults to document.body if null.
 *
 * @returns {void}
 */
declare const insertElementToDOM: (element: HTMLElement | string, position: InsertPosition | null, parent: HTMLElement | null) => void;

/**
 * Un type générique pour représenter une liste d'éléments HTML.
 * Il peut être un seul élément ou un tableau d'éléments.
 * @template T Le type de l'élément HTML (par défaut, HTMLElement).
 */
type ElementOrList<T extends HTMLElement> = T | NodeListOf<T>;
/**
 * Une version simplifiée du sélecteur jQuery.
 *
 * Si le sélecteur correspond à plusieurs éléments, un NodeListOf est retourné.
 * S'il correspond à un seul élément, l'élément lui-même est retourné.
 * Si aucun élément ne correspond, null est retourné.
 *
 * @param selector Le sélecteur CSS de l'élément à trouver.
 * @param asList Indique si le résultat doit être une liste même s'il n'y a qu'un seul élément.
 * @param parent L'élément parent dans lequel la recherche doit être effectuée (facultatif).
 * @returns Un seul élément, une liste d'éléments ou null.
 */
declare const $: <T extends HTMLElement>(selector: string, asList?: boolean, parent?: Document | HTMLElement) => ElementOrList<T> | null;

/**
 * Utilitaires pour la gestion du presse-papier
 */

/**
 * Copie du texte dans le presse-papier
 * @param text - Texte à copier
 * @param options - Options de configuration
 * @returns Promise<ClipboardResult>
 */
declare const copyToClipboard: (text: string, options?: ClipboardOptions) => Promise<ClipboardResult>;
/**
 * Gère la copie avec feedback visuel sur un bouton
 * @param button - Élément bouton
 * @param text - Texte à copier
 * @param options - Options de configuration
 */
declare const copyWithButtonFeedback: (button: HTMLElement, text: string, options?: ClipboardOptions) => Promise<ClipboardResult>;
/**
 * Initialise les gestionnaires de copie pour tous les éléments avec data-copy-target
 */
declare const initClipboardHandlers: () => void;
/**
 * Copie le contenu d'un élément par son ID
 * @param elementId - ID de l'élément contenant le texte à copier
 * @param options - Options de configuration
 */
declare const copyElementContent: (elementId: string, options?: ClipboardOptions) => Promise<ClipboardResult>;
/**
 * Vérifie si l'API Clipboard est disponible
 */
declare const isClipboardSupported: () => boolean;

/**
 * Extension Marked pour ajouter le support du surlignage (Highlight)
 * Convertit `==texte==` -> `<mark>texte</mark>`
 */
declare const highlightExtension: MarkedExtension;
/**
 * Convertit une chaîne de caractères Markdown en HTML.
 * @param markdownText Le texte source au format Markdown.
 * @returns Le texte converti au format HTML.
 */
declare const convertMarkdownToHtml: (markdownText: string) => string;

/**
 * Classe utilitaire pour manipuler les tailles de fichiers (Formatage et Parsing).
 */
declare class FileSizeFormatter {
    /**
     * Convertit la taille d'un fichier en octets vers un format plus lisible (octets, Ko, Mo, Go).
     * @param {number | null | undefined} filesize La taille du fichier en octets.
     * @param {number} precision Le nombre de décimales maximum (défaut: 2).
     */
    static format(filesize: number | null | undefined, precision?: number): string;
    /**
     * Convertit une chaîne de configuration (ex: "10M", "500K") en nombre d'octets.
     * @param sizeString La chaîne représentant la taille (ex: "10M").
     */
    static parse(sizeString: string): number;
    /**
     * Vérifie si une taille respecte la limite.
     * @param currentSize La taille du fichier en octets.
     * @param maxSizeString La limite sous forme de chaîne (ex: "10M").
     */
    static isValid(currentSize: number, maxSizeString: string): boolean;
}

/**
 * Enrichit un objet File brut (issu de la sérialisation Symfony) en FileProps complet
 * avec les champs calculés : iconClass, iconColor, formattedSize, uploadedBy.
 */
declare const FILE_ICON_MAP: Record<string, {
    icon: string;
    color: string;
}>;
declare const DEFAULT_ICON: {
    icon: string;
    color: string;
};

interface FileUploaderConfig {
    uploadUrl: string;
    inputElement: HTMLInputElement;
    fieldName?: string;
    maxSize?: string;
    allowedMimes?: string[];
    onSuccess?: (data: unknown) => void;
    onError?: (error: string) => void;
    onProgress?: (percent: number) => void;
    onPreview?: (base64Url: string) => void;
}
declare class FileUploader {
    private readonly uploadUrl;
    private readonly inputElement;
    private readonly fieldName;
    private readonly maxSize;
    private readonly allowedMimes;
    private readonly onSuccess?;
    private readonly onError?;
    private readonly onProgress?;
    private readonly onPreview?;
    constructor(config: FileUploaderConfig);
    private handleChange;
    private validate;
    private preview;
    private upload;
}

declare class FormManager {
    form: HTMLFormElement;
    initialData: FormDataType;
    static FORM_FIELD_SELECTOR: string;
    static FEEDBACK_SELECTORS: string[];
    static VALIDATION_SELECTORS: string[];
    constructor({ form, initialData }: FormType);
    getData(): FormDataType;
    fillData(data: FormDataType): void;
    validateData(violations: FormDataType): void;
    reset(): void;
    init(): void;
}

declare class SelectableField {
    private container;
    private options;
    private items;
    private observer;
    /**
     * @param container Le conteneur .form-selectable rendu par Twig
     * @param options Mode radio (forcé) ou nullable (checkbox classique)
     */
    constructor(container: HTMLElement, options?: SelectableOptions);
    private init;
    /**
     * Synchronise la classe CSS .active en fonction de la propriété checked réelle des inputs.
     */
    private syncVisualState;
    private handleSelection;
    /**
     * Utile si le composant est retiré du DOM pour éviter les fuites mémoire
     */
    destroy(): void;
}

/**
 * Custom error class for API request failures
 * @template T The type of data expected in the error response
 */
declare class ApiError<T = ApiErrorData> extends Error {
    readonly ok: boolean;
    readonly headers: Headers;
    readonly status: number;
    readonly statusText: string;
    readonly data: T;
    readonly response: Response;
    constructor(status: number, statusText: string, message: string, response: Response, data?: T);
    /**
     * Check if the error is a specific HTTP status
     */
    isStatus(status: number): boolean;
    /**
     * Check if the error is a client error (4xx)
     */
    isClientError(): boolean;
    /**
     * Check if the error is a server error (5xx)
     */
    isServerError(): boolean;
    /**
     * Check if the error is a network error (status 0)
     */
    isNetworkError(): boolean;
    /**
     * Get error message from data if available
     */
    getErrorMessage(): string;
    /**
     * Get validation errors if available
     */
    getValidationErrors(): Record<string, string | string[]> | null;
}

/**
 * Récupère directement le token API depuis les cookies.
 *
 * @returns Le token API (__ffr_v.aoth) ou null.
 */
declare const getApiToken: () => string | null;
interface AuthenticatedRequestOptions extends RequestOptions {
    isAPIAuthenticated?: boolean;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
}
/**
 * Enhanced fetch function for making API requests with Retry logic (Propulsé par Axios)
 *
 * @template T The expected type of the response data
 * @param {string} url The URL to make the request to
 * @param {RequestInit & AuthenticatedRequestOptions} options Request options (method, headers, body, etc.)
 * @returns {Promise<FetchResponse<T>>} A promise that resolves to a typed response
 * @throws {ApiError} Throws when the request fails or returns a non-2xx status
 */
declare const fetchAPI: <T = any>(url: string, options?: RequestInit & AuthenticatedRequestOptions) => Promise<FetchResponse<T>>;
/**
 * HTTP GET request
 */
declare const fetchGET: <T = any>(url: string, options?: Omit<AuthenticatedRequestOptions, "method" | "body">) => Promise<FetchResponse<T>>;
/**
 * HTTP POST request
 */
declare const fetchPOST: <T = any>(url: string, body?: any, options?: Omit<AuthenticatedRequestOptions, "method" | "body">) => Promise<FetchResponse<T>>;
/**
 * HTTP PUT request
 */
declare const fetchPUT: <T = any>(url: string, body?: any, options?: Omit<AuthenticatedRequestOptions, "method" | "body">) => Promise<FetchResponse<T>>;
/**
 * HTTP PATCH request
 */
declare const fetchPATCH: <T = any>(url: string, body?: any, options?: Omit<AuthenticatedRequestOptions, "method" | "body">) => Promise<FetchResponse<T>>;
/**
 * HTTP DELETE request
 */
declare const fetchDELETE: <T = any>(url: string, options?: Omit<AuthenticatedRequestOptions, "method" | "body">) => Promise<FetchResponse<T>>;
/**
 * Utility function to handle API responses with error handling
 */
declare const handleApiResponse: <T = any>(responsePromise: Promise<FetchResponse<T>>, onSuccess?: (data: T) => void, onError?: (error: ApiError) => void) => Promise<T | null>;
/**
 * Create a configured fetch client with base URL and default options
 */
declare const createApiClient: (baseURL: string, defaultOptions?: AuthenticatedRequestOptions) => {
    get: <T = any>(endpoint: string, options?: Omit<AuthenticatedRequestOptions, "method" | "body">) => Promise<FetchResponse<T>>;
    post: <T = any>(endpoint: string, body?: any, options?: Omit<AuthenticatedRequestOptions, "method" | "body">) => Promise<FetchResponse<T>>;
    put: <T = any>(endpoint: string, body?: any, options?: Omit<AuthenticatedRequestOptions, "method" | "body">) => Promise<FetchResponse<T>>;
    patch: <T = any>(endpoint: string, body?: any, options?: Omit<AuthenticatedRequestOptions, "method" | "body">) => Promise<FetchResponse<T>>;
    delete: <T = any>(endpoint: string, options?: Omit<AuthenticatedRequestOptions, "method" | "body">) => Promise<FetchResponse<T>>;
};

declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly INTERNAL_SERVER_ERROR: 500;
};

/**
 * Interface pour les paramètres de route, supportant des valeurs simples.
 */
interface RouteParams extends Record<string, string | number | boolean> {
}
/**
 * Génère une URL basée sur un chemin de base, en gérant le remplacement des paramètres
 * de chemin et l'ajout de paramètres de requête.
 *
 * Cette version utilise l'objet URL pour une gestion robuste des paramètres de requête.
 *
 * @param path Le chemin de la route, potentiellement avec des paramètres entre accolades (ex: /lists/{listId}/update).
 * @param params Un objet contenant les paramètres à appliquer. Les paramètres correspondants dans le chemin sont remplacés, les autres sont ajoutés en query string.
 * @param absoluteUrl Si true, préfixe l'URL avec l'origine de la fenêtre (window.location.origin).
 * @returns L'URL générée sous forme de chaîne.
 */
declare const router: (path: string, params?: RouteParams, absoluteUrl?: boolean) => string;

/**
 * Ajoute ou met à jour des paramètres de requête dans une URL donnée.
 * * @param url L'URL initiale (ex: /posts?limit=10 ou https://example.com/data).
 * @param params Objet des paramètres à ajouter ou mettre à jour.
 * @returns L'URL modifiée sous forme de chaîne.
 */
declare const addQueryParams: (url: string, params: RouteParams$1, baseUrl?: string) => string;
/**
 * Supprime un ou plusieurs paramètres de requête d'une URL donnée.
 * * @param url L'URL initiale.
 * @param keys Un tableau de chaînes représentant les clés de paramètres à supprimer.
 * @returns L'URL modifiée sous forme de chaîne.
 */
declare const removeQueryParams: (url: string, keys: string[], baseUrl?: string) => string;
/**
 * Extrait tous les paramètres de requête (query string) d'une URL et les retourne
 * sous forme d'un objet clé-valeur.
 * NOTE : Si un paramètre est présent plusieurs fois (ex: ?tag=a&tag=b), seule la première
 * valeur sera conservée dans l'objet résultant.
 *
 * @param url L'URL à analyser.
 * @returns Un objet Record<string, string> contenant les paramètres.
 */
declare const getQueryParams: (url: string, baseUrl?: string) => Record<string, string>;
declare const getCurrentUrl: () => string;
declare const getCurrentPath: () => string;

/**
 * Service utilitaire pour encapsuler l'utilisation du localStorage et sessionStorage.
 * Il gère la sérialisation/désérialisation JSON et les erreurs de quota.
 */
declare class StorageService {
    private storage;
    private readonly isAvailable;
    /**
     * Initialise le service.
     * @param storageStrategy La stratégie de stockage à utiliser (localStorage ou sessionStorage).
     */
    constructor(storageStrategy?: 'local' | 'session');
    /**
     * Tente de lire une valeur stockée et la désérialise en JSON si possible.
     *
     * @param key La clé de stockage.
     * @returns La valeur désérialisée (objet, chaîne, nombre, booléen) ou null.
     */
    get(key: string): unknown | null;
    /**
     * Stocke une valeur. Sérialise les objets et les tableaux en JSON.
     *
     * @param key La clé de stockage.
     * @param value La valeur à stocker.
     * @returns True si l'opération a réussi, False sinon.
     */
    set(key: string, value: unknown): boolean;
    /**
     * Supprime un élément du stockage.
     * @param key La clé de l'élément à supprimer.
     */
    remove(key: string): void;
    /**
     * Vide tout le stockage. **À utiliser avec précaution.**
     */
    clear(): void;
    /**
     * Vérifie si l'API de stockage est accessible.
     */
    private checkStorageAvailability;
}

/**
 * Utilitaires de manipulation de chaînes de caractères
 */
declare const isJSON: (value: string) => boolean;
declare const capitalize: (str: string) => string;
declare const randomStr: (length: number) => string;
declare const sanitize: (str: string) => string;
declare const slugify: (str: string, separator?: string) => string;
declare const truncate: (str: string, length: number) => string;
declare const camelCase: (str: string) => string;
declare const snakeCase: (str: string) => string;
declare const kebabCase: (str: string) => string;
declare const isEmpty: (str: string) => boolean;
declare const isURL: (value: string) => boolean;
declare const isEmail: (value: string) => boolean;
/**
 * Échappe les caractères HTML spéciaux pour prévenir les injections XSS.
 */
declare const escapeHtml: (unsafe: string | null | undefined) => string;
declare const encodeBase64: (val: string) => string;
declare const decodeBase64: (val: string) => string;

export { $, ANIMATION_DURATION, API_TOKEN_COOKIE_NAME, APP_WORKSPACE_DATA_SESSION_KEY, ApiError, type ApiErrorData, type AttributeMap, type AttributeValue, type AuthenticatedRequestOptions, BASE_URL, BREAKPOINTS, type BreakPointType, type BreakPointsInterface, type ClickHandler, type ClipboardOptions, type ClipboardResult, DEFAULT_DURATION, DEFAULT_FETCH_API_CONFIG, DEFAULT_ICON, DEFAULT_UPLOADER_OPTIONS, type DOMSelector, DateCalculator, type DateDiff, DateFormatter, type DateInput, type DateModifierOptions, type EventHandler, FILE_ICON_MAP, FILE_TYPES_CONFIG, type FetchResponse, type FileCategory, FileSizeFormatter, type FileTypeDefinition, FileUploader, type FileUploaderConfig, type FormDataType, FormManager, type FormType, type HTMLElementWithId, HTTP_STATUS, type RequestOptions, type ResizeHandler, type RouteParams$1 as RouteParams, SelectableField, type SelectableOptions, StorageService, type StorageStrategy, type TagNameType, type UploaderOptions, addQueryParams, camelCase, capitalize, convertMarkdownToHtml, copyElementContent, copyToClipboard, copyWithButtonFeedback, createApiClient, createElement, decodeBase64, encodeBase64, ensureDate, escapeHtml, fetchAPI, fetchDELETE, fetchGET, fetchPATCH, fetchPOST, fetchPUT, getApiToken, getCurrentPath, getCurrentUrl, getQueryParams, handleApiResponse, highlightExtension, initClipboardHandlers, insertElementToDOM, isClipboardSupported, isEmail, isEmpty, isJSON, isURL, kebabCase, randomStr, removeQueryParams, router, sanitize, slugify, snakeCase, truncate };
