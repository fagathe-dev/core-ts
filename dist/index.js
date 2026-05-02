// src/config/fetch.ts
var DEFAULT_FETCH_API_CONFIG = {
  timeout: 3e4,
  // 30 secondes
  retries: 2,
  // Par défaut, on peut mettre 2 retries (total 3 tentatives)
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

// src/config/file-types.ts
var FILE_TYPES_CONFIG = {
  ARCHIVE: {
    type: "Archive",
    extensions: ["zip", "rar", "7z", "tar", "gz"],
    mimeTypes: [
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
      "application/x-tar"
    ]
  },
  AUDIO: {
    type: "Audio",
    extensions: ["mp3", "wav", "ogg", "weba"],
    mimeTypes: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm"]
  },
  CODE: {
    type: "Code Source",
    extensions: [
      "html",
      "css",
      "js",
      "json",
      "ts",
      "php",
      "py",
      "java",
      "c",
      "cpp"
    ],
    mimeTypes: [
      "text/html",
      "text/css",
      "text/javascript",
      "application/json",
      "text/x-php"
    ]
  },
  DOCUMENT: {
    type: "Document",
    extensions: ["doc", "docx"],
    mimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
  },
  IMAGE: {
    type: "Image",
    extensions: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml"
    ]
  },
  PDF: {
    type: "PDF",
    extensions: ["pdf"],
    mimeTypes: ["application/pdf"]
  },
  PRESENTATION: {
    extensions: ["ppt", "pptx"],
    mimeTypes: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ]
  },
  SPREADSHEET: {
    type: "Feuille de calcul",
    extensions: ["xls", "xlsx", "csv"],
    mimeTypes: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv"
    ]
  },
  TEXT: {
    type: "Texte",
    extensions: ["txt", "md", "csv"],
    mimeTypes: ["text/plain", "text/markdown", "text/csv"]
  },
  VIDEO: {
    type: "Vid\xE9o",
    extensions: ["mp4", "webm", "ogg", "mov", "avi"],
    mimeTypes: [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo"
    ]
  }
};

// src/config/ui.ts
var ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 350
};
var DEFAULT_DURATION = 1e4;

// src/config/uploader.ts
var DEFAULT_UPLOADER_OPTIONS = {
  multiple: false,
  allowedTypes: "*",
  // Par défaut, on accepte tout
  enablePreview: true,
  // On active la prévisualisation par défaut
  previewContainer: void 0,
  // Sera généré automatiquement si non défini
  maxFileSize: "10M",
  // Taille max par défaut standard
  maxFiles: 1
  // Upload unitaire par défaut
};

// src/constants/app.ts
var APP_WORKSPACE_DATA_SESSION_KEY = "__ffr_v.wsp.app_data";
var API_TOKEN_COOKIE_NAME = "__ffr_v.aoth.tkn";

// src/constants/breakpoints.ts
var BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

// src/constants/routes.ts
var BASE_URL = window.location.origin;

// src/utils/date/helper.ts
function ensureDate(date) {
  if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      throw new Error("Invalid Date object passed");
    }
    return date;
  }
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date string: ${date}`);
  }
  return parsedDate;
}

// src/utils/date/calculator.ts
var DateCalculator = class {
  /**
   * Modifie une date en ajoutant/soustrayant des unités.
   * Retourne une NOUVELLE instance (Immutabilité).
   */
  static modify(date, options) {
    const d = new Date(ensureDate(date));
    if (options.years) d.setFullYear(d.getFullYear() + options.years);
    if (options.months) d.setMonth(d.getMonth() + options.months);
    if (options.days) d.setDate(d.getDate() + options.days);
    if (options.hours) d.setHours(d.getHours() + options.hours);
    if (options.minutes) d.setMinutes(d.getMinutes() + options.minutes);
    return d;
  }
  /**
   * Vérifie strictement si la date cible est dans le passé par rapport à maintenant.
   */
  static isPast(date) {
    const d = ensureDate(date);
    return d.getTime() < Date.now();
  }
  /**
   * Vérifie si la date cible est dans le futur.
   */
  static isFuture(date) {
    const d = ensureDate(date);
    return d.getTime() > Date.now();
  }
  /**
   * Calcule la différence détaillée entre deux dates.
   */
  static diff(date1, date2 = /* @__PURE__ */ new Date()) {
    const d1 = ensureDate(date1);
    const d2 = ensureDate(date2);
    let diffMs = Math.abs(d2.getTime() - d1.getTime());
    const SECOND = 1e3;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const YEAR = DAY * 365;
    const MONTH = DAY * 30;
    const years = Math.floor(diffMs / YEAR);
    diffMs -= years * YEAR;
    const months = Math.floor(diffMs / MONTH);
    diffMs -= months * MONTH;
    const days = Math.floor(diffMs / DAY);
    diffMs -= days * DAY;
    const hours = Math.floor(diffMs / HOUR);
    diffMs -= hours * HOUR;
    const minutes = Math.floor(diffMs / MINUTE);
    diffMs -= minutes * MINUTE;
    const seconds = Math.floor(diffMs / SECOND);
    return { years, months, days, hours, minutes, seconds };
  }
};

// src/utils/date/formatter.ts
var DateFormatter = class {
  static LOCALE = "fr-FR";
  static TIMEZONE = "Europe/Paris";
  /**
   * Format compact pour les listes : "2 déc. 15:00"
   */
  static todo(date) {
    const d = ensureDate(date);
    const formatted = new Intl.DateTimeFormat(this.LOCALE, {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZone: this.TIMEZONE
    }).format(d);
    return formatted.replace(" \xE0", "");
  }
  /**
   * Format complet : "mercredi 2 avril 2025 à 23:29"
   */
  static full(date) {
    const d = ensureDate(date);
    return new Intl.DateTimeFormat(this.LOCALE, {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: this.TIMEZONE
    }).format(d);
  }
  /**
   * Format court : "12/12/2023"
   */
  static short(date) {
    const d = ensureDate(date);
    return new Intl.DateTimeFormat(this.LOCALE, {
      dateStyle: "short",
      timeZone: this.TIMEZONE
    }).format(d);
  }
  /**
   * Format relatif : "il y a 5 minutes", "à l'instant"
   */
  static ago(date) {
    const d = ensureDate(date);
    const now = /* @__PURE__ */ new Date();
    const diffInSeconds = (d.getTime() - now.getTime()) / 1e3;
    const rtf = new Intl.RelativeTimeFormat(this.LOCALE, { numeric: "auto" });
    if (Math.abs(diffInSeconds) < 60) {
      return "\xE0 l'instant";
    }
    const minutes = diffInSeconds / 60;
    if (Math.abs(minutes) < 60) {
      return rtf.format(Math.round(minutes), "minute");
    }
    const hours = minutes / 60;
    if (Math.abs(hours) < 24) {
      return rtf.format(Math.round(hours), "hour");
    }
    const days = hours / 24;
    if (Math.abs(days) < 30) {
      return rtf.format(Math.round(days), "day");
    }
    const months = days / 30;
    if (Math.abs(months) < 12) {
      return rtf.format(Math.round(months), "month");
    }
    const years = days / 365;
    return rtf.format(Math.round(years), "year");
  }
};

// src/utils/dom/createElement.ts
var createElement = (tagName, classes, id, attributes) => {
  const element = document.createElement(tagName);
  if (classes) element.className = classes;
  if (id) element.id = id;
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (value === true) {
        element.setAttribute(key, "");
      } else if (value !== false && value != null) {
        element.setAttribute(key, String(value));
      }
    });
  }
  return element;
};

// src/utils/dom/insertElementToDOM.ts
var insertElementToDOM = (element, position, parent) => {
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

// src/utils/dom/selector.ts
var $ = (selector, asList = false, parent = document) => {
  const elements = parent.querySelectorAll(selector);
  if (elements.length === 1 && !asList) {
    return elements[0];
  }
  if (elements.length > 1 || asList) {
    return elements;
  }
  return null;
};

// src/utils/features/clipboard.ts
var copyToClipboard = async (text, options = {}) => {
  const {
    showFeedback = true,
    feedbackDuration = 2e3,
    successMessage = "Copi\xE9 !",
    errorMessage = "Erreur lors de la copie"
  } = options;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      await fallbackCopyToClipboard(text);
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
};
var fallbackCopyToClipboard = async (text) => {
  return new Promise((resolve, reject) => {
    const textArea = createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        resolve();
      } else {
        reject(new Error("La commande de copie a \xE9chou\xE9"));
      }
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  });
};
var copyWithButtonFeedback = async (button, text, options = {}) => {
  const {
    feedbackDuration = 2e3,
    successMessage = "Copi\xE9 !",
    errorMessage = "Erreur"
  } = options;
  const originalContent = button.innerHTML;
  const originalClasses = Array.from(button.classList);
  const result = await copyToClipboard(text, options);
  if (result.success) {
    button.innerHTML = `<i class="ds ds-tick me-1"></i>${successMessage}`;
    button.classList.remove("btn-outline-secondary");
    button.classList.add("btn-success");
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.className = originalClasses.join(" ");
    }, feedbackDuration);
  } else {
    button.innerHTML = `<i class="ds ds-cross-circle me-1"></i>${errorMessage}`;
    button.classList.remove("btn-outline-secondary");
    button.classList.add("btn-danger");
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.className = originalClasses.join(" ");
    }, feedbackDuration / 2);
  }
  return result;
};
var initClipboardHandlers = () => {
  const copyButtons = document.querySelectorAll("[data-copy-target]");
  copyButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const targetId = button.getAttribute("data-copy-target");
      if (!targetId) return;
      const targetElement = document.getElementById(targetId);
      if (!targetElement) {
        return;
      }
      const codeElement = targetElement.querySelector("code");
      const text = codeElement ? codeElement.textContent || codeElement.innerText : targetElement.textContent || targetElement.innerText;
      if (!text) {
        return;
      }
      await copyWithButtonFeedback(button, text, {
        successMessage: "Copi\xE9 !",
        errorMessage: "Erreur",
        feedbackDuration: 2e3
      });
    });
  });
};
var copyElementContent = async (elementId, options = {}) => {
  const element = document.getElementById(elementId);
  if (!element) {
    return {
      success: false,
      error: `\xC9l\xE9ment non trouv\xE9: ${elementId}`
    };
  }
  const text = element.textContent || element.innerText || "";
  return copyToClipboard(text, options);
};
var isClipboardSupported = () => {
  return !!(navigator.clipboard && window.isSecureContext) || document.queryCommandSupported?.("copy") || false;
};

// src/utils/features/marked.ts
import { marked } from "marked";
var highlightExtension = {
  extensions: [
    {
      name: "highlight",
      level: "inline",
      start(src) {
        return src.indexOf("==");
      },
      tokenizer(src) {
        const rule = /^==(.+?)==/;
        const match = rule.exec(src);
        if (match) {
          const text = match[1];
          return {
            type: "highlight",
            raw: match[0],
            // La chaîne complète : ==texte==
            text,
            // Le contenu : texte
            // Analyse récursive du contenu (permet le gras/italique à l'intérieur)
            tokens: this.lexer.inlineTokens(text)
          };
        }
        return void 0;
      },
      renderer(token) {
        const highlightToken = token;
        return `<mark>${this.parser.parseInline(highlightToken.tokens)}</mark>`;
      }
    }
  ]
};
marked.use(highlightExtension);
var convertMarkdownToHtml = (markdownText) => {
  if (!markdownText) {
    return "";
  }
  const html = marked.parse(markdownText, { async: false, gfm: true });
  return html;
};

// src/utils/file/FileSizeFormatter.ts
var FileSizeFormatter = class _FileSizeFormatter {
  /**
   * Convertit la taille d'un fichier en octets vers un format plus lisible (octets, Ko, Mo, Go).
   * @param {number | null | undefined} filesize La taille du fichier en octets.
   * @param {number} precision Le nombre de décimales maximum (défaut: 2).
   */
  static format(filesize, precision = 2) {
    if (filesize === 0 || filesize === null || filesize === void 0) {
      return "0 octets";
    }
    const units = ["octets", "Ko", "Mo", "Go", "To", "Po", "Eo", "Zo", "Yo"];
    let power = filesize > 0 ? Math.floor(Math.log(filesize) / Math.log(1024)) : 0;
    power = Math.min(power, units.length - 1);
    const size = filesize / Math.pow(1024, power);
    const formatted = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision
    }).format(size);
    return `${formatted} ${units[power]}`;
  }
  /**
   * Convertit une chaîne de configuration (ex: "10M", "500K") en nombre d'octets.
   * @param sizeString La chaîne représentant la taille (ex: "10M").
   */
  static parse(sizeString) {
    if (!sizeString) return 0;
    const normalized = sizeString.trim().toUpperCase();
    const unitMatch = normalized.match(/[A-Z]+/);
    const unit = unitMatch ? unitMatch[0].charAt(0) : "";
    const value = parseFloat(normalized);
    if (isNaN(value))
      throw new Error(
        `FileSizeFormatter: Format de taille invalide "${sizeString}"`
      );
    switch (unit) {
      case "K":
        return value * 1024;
      case "M":
        return value * 1024 * 1024;
      case "G":
        return value * 1024 * 1024 * 1024;
      case "T":
        return value * 1024 * 1024 * 1024 * 1024;
      default:
        return value;
    }
  }
  /**
   * Vérifie si une taille respecte la limite.
   * @param currentSize La taille du fichier en octets.
   * @param maxSizeString La limite sous forme de chaîne (ex: "10M").
   */
  static isValid(currentSize, maxSizeString) {
    return currentSize <= _FileSizeFormatter.parse(maxSizeString);
  }
};

// src/utils/file/mapFileIcon.ts
var FILE_ICON_MAP = {
  pdf: { icon: "fas fa-file-pdf", color: "danger" },
  doc: { icon: "fas fa-file-word", color: "primary" },
  docx: { icon: "fas fa-file-word", color: "primary" },
  xls: { icon: "fas fa-file-excel", color: "success" },
  xlsx: { icon: "fas fa-file-excel", color: "success" },
  csv: { icon: "fas fa-file-csv", color: "success" },
  ppt: { icon: "fas fa-file-powerpoint", color: "warning" },
  pptx: { icon: "fas fa-file-powerpoint", color: "warning" },
  jpg: { icon: "fas fa-file-image", color: "info" },
  jpeg: { icon: "fas fa-file-image", color: "info" },
  png: { icon: "fas fa-file-image", color: "info" },
  gif: { icon: "fas fa-file-image", color: "info" },
  svg: { icon: "fas fa-file-image", color: "info" },
  webp: { icon: "fas fa-file-image", color: "info" },
  mp4: { icon: "fas fa-file-video", color: "purple" },
  avi: { icon: "fas fa-file-video", color: "purple" },
  mov: { icon: "fas fa-file-video", color: "purple" },
  mp3: { icon: "fas fa-file-audio", color: "secondary" },
  wav: { icon: "fas fa-file-audio", color: "secondary" },
  zip: { icon: "fas fa-file-archive", color: "dark" },
  rar: { icon: "fas fa-file-archive", color: "dark" },
  "7z": { icon: "fas fa-file-archive", color: "dark" },
  txt: { icon: "fas fa-file-alt", color: "muted" },
  json: { icon: "fas fa-file-code", color: "primary" },
  js: { icon: "fas fa-file-code", color: "warning" },
  ts: { icon: "fas fa-file-code", color: "primary" },
  html: { icon: "fas fa-file-code", color: "danger" },
  css: { icon: "fas fa-file-code", color: "info" },
  php: { icon: "fas fa-file-code", color: "purple" }
};
var DEFAULT_ICON = { icon: "fas fa-file", color: "muted" };

// src/utils/request/fetch.ts
import axios from "axios";

// src/utils/request/api-error.ts
var ApiError = class extends Error {
  ok = false;
  headers;
  status;
  statusText;
  data;
  response;
  constructor(status, statusText, message, response, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.headers = response.headers;
    this.data = data;
  }
  /**
   * Check if the error is a specific HTTP status
   */
  isStatus(status) {
    return this.status === status;
  }
  /**
   * Check if the error is a client error (4xx)
   */
  isClientError() {
    return this.status >= 400 && this.status < 500;
  }
  /**
   * Check if the error is a server error (5xx)
   */
  isServerError() {
    return this.status >= 500 && this.status < 600;
  }
  /**
   * Check if the error is a network error (status 0)
   */
  isNetworkError() {
    return this.status === 0;
  }
  /**
   * Get error message from data if available
   */
  getErrorMessage() {
    if (typeof this.data === "object" && this.data && "message" in this.data) {
      return String(this.data.message);
    }
    return this.message;
  }
  /**
   * Get validation errors if available
   */
  getValidationErrors() {
    if (typeof this.data === "object" && this.data && "errors" in this.data) {
      return this.data.errors;
    }
    return null;
  }
};

// src/utils/storage/cookies.ts
var CookieHelper = class {
  /**
   * Récupère tous les cookies sous forme d'objet associatif.
   *
   * @returns Un objet où les clés sont les noms des cookies et les valeurs sont leurs valeurs.
   */
  static getAll() {
    const cookies = {};
    if (document.cookie === "") {
      return cookies;
    }
    const ca = document.cookie.split(";");
    for (const cookie of ca) {
      const c = cookie.trim();
      const eqIndex = c.indexOf("=");
      if (eqIndex > 0) {
        const key = decodeURIComponent(c.substring(0, eqIndex));
        const value = decodeURIComponent(c.substring(eqIndex + 1));
        cookies[key] = value;
      }
    }
    return cookies;
  }
  /**
   * Récupère la valeur d'un cookie spécifique par son nom.
   *
   * @param key Le nom du cookie à récupérer.
   * @param defaultValue La valeur à retourner si le cookie n'est pas trouvé.
   * @returns La valeur du cookie ou la valeur par défaut.
   */
  static get(key, defaultValue = null) {
    return this.getAll()[key] ?? defaultValue;
  }
  /**
   * Définit (crée ou met à jour) un cookie.
   *
   * @param key Le nom du cookie.
   * @param value La valeur du cookie.
   * @param expireDays Le nombre de jours avant l'expiration (par défaut 365).
   */
  static set(key, value, expireDays = 365) {
    const date = /* @__PURE__ */ new Date();
    date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1e3);
    const expires = date.toUTCString();
    const baseCookie = `${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/; SameSite=Lax`;
    const securePart = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = baseCookie + securePart;
  }
  /**
   * Supprime un cookie en définissant sa date d'expiration dans le passé.
   *
   * @param key Le nom du cookie à supprimer.
   */
  static delete(key) {
    const date = (/* @__PURE__ */ new Date(0)).toUTCString();
    document.cookie = `${encodeURIComponent(
      key
    )}=; expires=${date}; path=/; SameSite=Lax`;
  }
  /**
   * Vérifie l'existence d'un cookie basé sur la clé.
   *
   * @param key La clé du cookie à vérifier.
   * @returns True si le cookie existe, False sinon.
   */
  static has(key) {
    return Object.prototype.hasOwnProperty.call(this.getAll(), key);
  }
  /**
   * Supprime tous les cookies du domaine/chemin actuel en les faisant expirer.
   */
  static clear() {
    const cookies = this.getAll();
    for (const key in cookies) {
      this.delete(key);
    }
  }
};

// src/utils/request/fetch.ts
var getApiToken = () => CookieHelper.get(API_TOKEN_COOKIE_NAME);
var fetchAPI = async (url, options = {}) => {
  const {
    timeout = DEFAULT_FETCH_API_CONFIG.timeout,
    retries = DEFAULT_FETCH_API_CONFIG.retries,
    isAPIAuthenticated = false,
    onUploadProgress,
    onDownloadProgress,
    responseType,
    ...requestOptions
  } = options;
  let bodyData = requestOptions.body;
  if (bodyData && typeof bodyData === "object" && !(bodyData instanceof FormData) && !(bodyData instanceof URLSearchParams) && !(bodyData instanceof Blob) && !(bodyData instanceof ArrayBuffer) && typeof bodyData !== "string") {
    bodyData = JSON.stringify(bodyData);
  }
  const headers = {
    ...DEFAULT_FETCH_API_CONFIG.headers,
    ...requestOptions.headers
  };
  if (bodyData instanceof FormData && headers["Content-Type"] === "application/json") {
    delete headers["Content-Type"];
  }
  if (isAPIAuthenticated) {
    const apiToken = getApiToken();
    if (apiToken) {
      headers["X-AUTH-TOKEN"] = apiToken;
    } else {
      console.warn(
        `Token API (${API_TOKEN_COOKIE_NAME}) manquant pour une requ\xEAte authentifi\xE9e vers ${url}`
      );
    }
  }
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const axiosConfig = {
        url,
        method: requestOptions.method || "GET",
        headers,
        data: bodyData,
        // Axios utilise "data" là où fetch utilise "body"
        signal: controller.signal,
        onUploadProgress,
        onDownloadProgress,
        responseType: responseType || "text",
        // On force texte pour simuler response.text() du fetch
        validateStatus: () => true
        // Ne pas throw d'erreur Axios pour laisser l'ApiError prendre le relais
      };
      const response = await axios(axiosConfig);
      clearTimeout(timeoutId);
      let textContent = "";
      let data;
      let blob;
      if (response.data instanceof Blob) {
        blob = response.data;
        data = {};
      } else {
        textContent = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
        blob = new Blob([textContent]);
        try {
          data = textContent ? JSON.parse(textContent) : {};
        } catch (e) {
          data = {};
        }
      }
      const fetchHeaders = new Headers();
      if (response.headers) {
        Object.entries(response.headers).forEach(([key, value]) => {
          if (typeof value === "string") fetchHeaders.append(key, value);
          else if (Array.isArray(value))
            value.forEach((v) => fetchHeaders.append(key, String(v)));
        });
      }
      const isOk = response.status >= 200 && response.status < 300;
      const nativeResponse = new Response(
        response.data instanceof Blob ? response.data : textContent,
        {
          status: response.status,
          statusText: response.statusText,
          headers: fetchHeaders
        }
      );
      const apiResponse = {
        ok: isOk,
        headers: fetchHeaders,
        status: response.status,
        statusText: response.statusText,
        data,
        text: textContent,
        blob
      };
      if (!isOk) {
        throw new ApiError(
          response.status,
          response.statusText,
          typeof data === "object" && data && "message" in data ? String(data.message) : `Request failed with status ${response.status}`,
          nativeResponse,
          data
        );
      }
      return apiResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      if (axios.isCancel(error) && !controller.signal.aborted) {
        break;
      }
      if (attempt < retries) {
        continue;
      }
    }
  }
  if (lastError instanceof ApiError) {
    throw lastError;
  }
  if (axios.isCancel(lastError) || lastError instanceof DOMException && lastError.name === "AbortError") {
    throw new ApiError(
      408,
      "Request Timeout",
      `Request timed out after ${timeout}ms (${retries + 1} attempts)`,
      new Response(),
      { message: "Request Timeout" }
    );
  }
  throw new ApiError(
    0,
    "Network Error",
    lastError instanceof Error ? lastError.message : "Unknown error occurred",
    new Response(),
    { message: "Network Error" }
  );
};
var fetchGET = async (url, options = {}) => {
  return fetchAPI(url, { ...options, method: "GET" });
};
var fetchPOST = async (url, body, options = {}) => {
  const requestOptions = {
    ...options,
    method: "POST"
  };
  if (body !== void 0) {
    requestOptions.body = body;
  }
  return fetchAPI(url, requestOptions);
};
var fetchPUT = async (url, body, options = {}) => {
  const requestOptions = {
    ...options,
    method: "PUT"
  };
  if (body !== void 0) {
    requestOptions.body = body;
  }
  return fetchAPI(url, requestOptions);
};
var fetchPATCH = async (url, body, options = {}) => {
  const requestOptions = {
    ...options,
    method: "PATCH"
  };
  if (body !== void 0) {
    requestOptions.body = body;
  }
  return fetchAPI(url, requestOptions);
};
var fetchDELETE = async (url, options = {}) => {
  return fetchAPI(url, { ...options, method: "DELETE" });
};
var handleApiResponse = async (responsePromise, onSuccess, onError) => {
  try {
    const response = await responsePromise;
    if (onSuccess) {
      onSuccess(response.data);
    }
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && onError) {
      onError(error);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
};
var createApiClient = (baseURL, defaultOptions = {}) => {
  return {
    get: (endpoint, options = {}) => fetchGET(`${baseURL}${endpoint}`, {
      ...defaultOptions,
      ...options
    }),
    post: (endpoint, body, options = {}) => fetchPOST(`${baseURL}${endpoint}`, body, {
      ...defaultOptions,
      ...options
    }),
    put: (endpoint, body, options = {}) => fetchPUT(`${baseURL}${endpoint}`, body, {
      ...defaultOptions,
      ...options
    }),
    patch: (endpoint, body, options = {}) => fetchPATCH(`${baseURL}${endpoint}`, body, {
      ...defaultOptions,
      ...options
    }),
    delete: (endpoint, options = {}) => fetchDELETE(`${baseURL}${endpoint}`, {
      ...defaultOptions,
      ...options
    })
  };
};

// src/utils/file/uploader.ts
var FileUploader = class {
  uploadUrl;
  inputElement;
  fieldName;
  maxSize;
  allowedMimes;
  onSuccess;
  onError;
  onProgress;
  onPreview;
  constructor(config) {
    this.uploadUrl = config.uploadUrl;
    this.inputElement = config.inputElement;
    this.fieldName = config.fieldName ?? "avatar";
    this.maxSize = config.maxSize ?? null;
    this.allowedMimes = config.allowedMimes ?? null;
    this.onSuccess = config.onSuccess;
    this.onError = config.onError;
    this.onProgress = config.onProgress;
    this.onPreview = config.onPreview;
    this.inputElement.addEventListener("change", this.handleChange.bind(this));
  }
  handleChange() {
    const file = this.inputElement.files?.[0];
    if (!file) return;
    if (!this.validate(file)) return;
    this.preview(file);
    this.upload(file);
  }
  validate(file) {
    if (this.maxSize && !FileSizeFormatter.isValid(file.size, this.maxSize)) {
      this.onError?.(
        `Le fichier d\xE9passe la taille maximale autoris\xE9e (${this.maxSize}).`
      );
      return false;
    }
    if (this.allowedMimes && !this.allowedMimes.includes(file.type)) {
      this.onError?.(
        `Type de fichier non autoris\xE9 (${file.type}). Types accept\xE9s : ${this.allowedMimes.join(", ")}.`
      );
      return false;
    }
    return true;
  }
  preview(file) {
    if (!this.onPreview || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        this.onPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }
  async upload(file) {
    const formData = new FormData();
    formData.append(this.fieldName, file);
    try {
      const response = await fetchAPI(this.uploadUrl, {
        method: "POST",
        body: formData,
        onUploadProgress: (event) => {
          if (this.onProgress && event.total) {
            const percent = Math.round(event.loaded * 100 / event.total);
            this.onProgress(percent);
          }
        }
      });
      this.onSuccess?.(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        this.onError?.(error.getErrorMessage());
      } else {
        this.onError?.(
          error instanceof Error ? error.message : "Erreur inconnue"
        );
      }
    }
  }
};

// src/utils/forms/field-actions/clear.ts
var clearTextarea = (textarea) => {
  textarea.value = "";
  const event = new Event("input", { bubbles: true });
  textarea.dispatchEvent(event);
};
var clearCheck = (input) => {
  input.checked = false;
  const event = new Event("input", { bubbles: true });
  input.dispatchEvent(event);
};
var clearInput = (input) => {
  if (input.type === "checkbox" || input.type === "radio") {
    input.checked = false;
  } else {
    input.value = "";
  }
  const event = new Event("input", { bubbles: true });
  input.dispatchEvent(event);
};
var clearSelect = (select) => {
  Array.from(select.options).forEach((option) => {
    option.selected = false;
  });
  const event = new Event("change", { bubbles: true });
  select.dispatchEvent(event);
};
var clearValidation = (form, validationClass) => {
  const fields = $(validationClass, true, form);
  fields.forEach((field) => {
    field.classList.remove(validationClass);
  });
};

// src/utils/forms/field-actions/fill.ts
var fillTextarea = (textarea, text) => {
  textarea.value = text;
  const event = new Event("input", { bubbles: true });
  textarea.dispatchEvent(event);
};
var fillRadio = (name, value) => {
  const targetValue = String(value);
  const radioButtons = document.querySelectorAll(
    `input[type="radio"][name="${name}"]`
  );
  radioButtons.forEach((input) => {
    if (input.value === targetValue) {
      input.checked = true;
      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
    }
    if (value === null || value === false) {
      input.checked = false;
    } else {
      input.checked = false;
    }
  });
};
var selectOption = (select, value) => {
  const isMultiple = select.multiple;
  const values = Array.isArray(value) ? value : [value];
  Array.from(select.options).forEach((option) => {
    option.selected = values.includes(option.value);
  });
  const event = new Event("change", { bubbles: true });
  select.dispatchEvent(event);
};
var fillCheckboxes = (name, values) => {
  const checkboxes = $(
    `input[type="checkbox"][name="${name}"]`,
    true
  );
  checkboxes.forEach((input) => {
    input.checked = values.includes(input.value);
    const event = new Event("input", { bubbles: true });
    input.dispatchEvent(event);
  });
};

// src/utils/forms/field-actions/get.ts
var getCheckboxesValue = (checkboxes) => {
  const values = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      values.push(checkbox.value);
    }
  });
  return values.length > 0 ? values : null;
};
var getRadioValue = (radioButtons) => {
  for (const radio of radioButtons) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return null;
};
var getInputValue = (input) => {
  const { type } = input;
  if (type === "text" || type === "number" || type === "date" || type === "datetime" || type === "password" || type === "hidden") {
    return input.value !== "" ? input.value : null;
  }
  return null;
};
var getSelectValue = (select) => {
  const selectedOptions = Array.from(select.options).filter(
    (option) => option.selected
  );
  if (selectedOptions.length === 0) {
    return null;
  }
  if (select.multiple) {
    return selectedOptions.map((option) => option.value);
  } else {
    return selectedOptions[0].value;
  }
};
var getTextareaValue = (textarea) => {
  return textarea.value !== "" ? textarea.value : null;
};

// src/utils/forms/FormManager.ts
var FormManager = class _FormManager {
  form;
  initialData;
  static FORM_FIELD_SELECTOR = "input, select, textarea";
  static FEEDBACK_SELECTORS = [
    ".invalid-feedback",
    ".valid-feedback"
  ];
  static VALIDATION_SELECTORS = [".is-valid", ".is-invalid"];
  constructor({ form, initialData }) {
    this.form = form;
    this.initialData = initialData;
    this.init();
  }
  getData() {
    const fields = $(
      _FormManager.FORM_FIELD_SELECTOR,
      true,
      this.form
    );
    const data = {};
    for (const field of Array.from(fields)) {
      const { tagName, name } = field;
      switch (tagName) {
        case "INPUT": {
          const { type } = field;
          if (Object.prototype.hasOwnProperty.call(data, name)) {
            continue;
          } else {
            if (type === "checkbox") {
              const choices = getCheckboxesValue(
                $(
                  `input[name="${name}"]`,
                  true,
                  this.form
                )
              );
              data[name] = choices;
              continue;
            }
            if (type === "radio") {
              const choice = getRadioValue(
                $(
                  `input[name="${name}"]`,
                  true,
                  this.form
                )
              );
              data[name] = choice;
              continue;
            }
            if (type === "text" || type === "number" || type === "date" || type === "datetime" || type === "password" || type === "hidden") {
              data[name] = getInputValue(field);
            }
          }
          break;
        }
        case "SELECT":
          data[name] = getSelectValue(field);
          break;
        case "TEXTAREA":
          data[name] = getTextareaValue(field);
          break;
        default:
          break;
      }
    }
    return data;
  }
  fillData(data) {
    const fields = this.form.querySelectorAll(_FormManager.FORM_FIELD_SELECTOR);
    for (const field of Array.from(fields)) {
      const { tagName, name } = field;
      if (Object.prototype.hasOwnProperty.call(data, name)) {
        let value = data[name];
        switch (tagName) {
          case "INPUT": {
            const { type } = field;
            if (type === "checkbox") {
              value = Array.isArray(value) ? value = value : [value];
              fillCheckboxes(name, value);
            }
            if (type === "radio") {
              fillRadio(name, value);
            }
            if (type === "text" || type === "number" || type === "date" || type === "datetime" || type === "password" || type === "hidden") {
              field.value = value;
            }
            break;
          }
          case "SELECT":
            selectOption(
              field,
              value
            );
            break;
          case "TEXTAREA":
            fillTextarea(field, value);
            break;
          default:
            break;
        }
      } else {
        continue;
      }
    }
  }
  validateData(violations) {
    const fields = this.form.querySelectorAll(_FormManager.FORM_FIELD_SELECTOR);
    for (const field of Array.from(fields)) {
      const { tagName, name } = field;
      const container = field.closest("fieldset") || field.closest("div");
      let error = container.querySelector(".invalid-feedback");
      if (Object.prototype.hasOwnProperty.call(violations, name)) {
        if (tagName === "INPUT" && field.type === "checkbox" || field.type === "radio") {
          const choices = this.form.querySelectorAll(
            `input[name="${name}"]`
          );
          choices.forEach((el) => {
            el.classList.add("is-invalid");
          });
        } else {
          field.classList.add("is-invalid");
        }
        if (error === null) {
          error = createElement("small");
          error.innerHTML = violations[name];
          error.classList.add("invalid-feedback");
          container.insertAdjacentElement("beforeend", error);
        }
      } else {
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
        if (error !== null) {
          error.remove();
        }
      }
    }
  }
  reset() {
    const fields = this.form.querySelectorAll(_FormManager.FORM_FIELD_SELECTOR);
    _FormManager.FEEDBACK_SELECTORS.forEach((selector) => {
      clearValidation(this.form, selector);
    });
    _FormManager.VALIDATION_SELECTORS.forEach((selector) => {
      clearValidation(this.form, selector);
    });
    fields.forEach((field) => {
      const { tagName } = field;
      const container = field.closest("fieldset") || field.closest("div");
      if (tagName === "INPUT") {
        const { type } = field;
        if (type === "checkbox" || type === "radio") {
          clearCheck(field);
        }
        if (type === "text" || type === "number" || type === "date" || type === "datetime" || type === "password" || type === "hidden") {
          clearInput(field);
        }
      }
      if (tagName === "SELECT") {
        clearSelect(field);
      }
      if (tagName === "TEXTAREA") {
        clearTextarea(field);
      }
    });
  }
  init() {
    this.form.addEventListener("reset", (e) => {
      e.preventDefault();
      this.reset();
    });
    if (this.initialData) {
      this.fillData(this.initialData);
    }
  }
};

// src/utils/forms/selectable.ts
var SelectableField = class {
  /**
   * @param container Le conteneur .form-selectable rendu par Twig
   * @param options Mode radio (forcé) ou nullable (checkbox classique)
   */
  constructor(container, options = { mode: "radio" }) {
    this.container = container;
    this.options = options;
    this.items = this.container.querySelectorAll(".form-selectable-item");
    this.init();
  }
  container;
  options;
  items;
  observer = null;
  init() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const input = mutation.target;
          const item = input.closest(".form-selectable-item");
          if (item) {
            item.classList.toggle(
              "is-invalid",
              input.classList.contains("is-invalid")
            );
            item.classList.toggle(
              "is-valid",
              input.classList.contains("is-valid")
            );
          }
        }
      });
    });
    this.items.forEach((item) => {
      const input = item.querySelector(
        ".form-selectable-input"
      );
      if (this.observer) {
        this.observer.observe(input, {
          attributes: true,
          attributeFilter: ["class"]
        });
      }
      input.addEventListener("input", () => this.syncVisualState());
      input.addEventListener("change", () => this.syncVisualState());
      item.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleSelection(item, input);
      });
    });
    this.syncVisualState();
  }
  /**
   * Synchronise la classe CSS .active en fonction de la propriété checked réelle des inputs.
   */
  syncVisualState() {
    this.items.forEach((item) => {
      const input = item.querySelector(
        ".form-selectable-input"
      );
      item.classList.toggle("active", input.checked);
    });
  }
  handleSelection(clickedItem, clickedInput) {
    const wasChecked = clickedInput.checked;
    if (this.options.mode === "radio") {
      if (wasChecked) return;
      this.items.forEach((item) => {
        const input = item.querySelector(
          ".form-selectable-input"
        );
        if (input !== clickedInput && input.checked) {
          input.checked = false;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
      clickedInput.checked = true;
    } else {
      clickedInput.checked = !wasChecked;
    }
    clickedInput.dispatchEvent(new Event("input", { bubbles: true }));
    clickedInput.dispatchEvent(new Event("change", { bubbles: true }));
    if (this.options.onSelect) {
      this.options.onSelect(clickedInput.checked ? clickedInput.value : null);
    }
  }
  /**
   * Utile si le composant est retiré du DOM pour éviter les fuites mémoire
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};

// src/utils/request/http-status.ts
var HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// src/utils/request/router.ts
var router = (path, params = {}, absoluteUrl = false) => {
  const remainingParams = { ...params };
  let finalPath = path;
  finalPath = finalPath.replace(/{(\w+)}/g, (match, paramName) => {
    if (Object.prototype.hasOwnProperty.call(remainingParams, paramName)) {
      const value = remainingParams[paramName];
      delete remainingParams[paramName];
      return String(value);
    }
    return "";
  });
  finalPath = finalPath.replace(/\/{2,}/g, "/");
  const searchParams = new URLSearchParams();
  for (const key in remainingParams) {
    if (Object.prototype.hasOwnProperty.call(remainingParams, key)) {
      const value = remainingParams[key];
      searchParams.append(key, String(value));
    }
  }
  const queryString = searchParams.toString();
  let baseUrl = finalPath;
  if (queryString) {
    baseUrl += (baseUrl.includes("?") ? "&" : "?") + queryString;
  }
  if (absoluteUrl && typeof window !== "undefined" && window.location.origin) {
    try {
      const url = new URL(
        baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`,
        window.location.origin
      );
      return url.href;
    } catch (error) {
      return baseUrl;
    }
  }
  return baseUrl;
};

// src/utils/request/url.ts
var safeCreateUrl = (urlString, baseUrl = BASE_URL) => {
  try {
    if (urlString.startsWith("http")) {
      return new URL(urlString);
    }
    return new URL(urlString, baseUrl);
  } catch (e) {
    console.error("Unable to create a safe URL", e);
    return null;
  }
};
var addQueryParams = (url, params, baseUrl = BASE_URL) => {
  const isAbsolute = url.startsWith("http");
  const urlObject = safeCreateUrl(url, baseUrl);
  if (!urlObject) {
    return url;
  }
  const searchParams = urlObject.searchParams;
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      searchParams.set(key, String(value));
    }
  }
  const resultUrl = urlObject.pathname + urlObject.search + urlObject.hash;
  if (isAbsolute) {
    return urlObject.origin + resultUrl;
  }
  return resultUrl;
};
var removeQueryParams = (url, keys, baseUrl = BASE_URL) => {
  const isAbsolute = url.startsWith("http");
  const urlObject = safeCreateUrl(url, baseUrl);
  if (!urlObject) {
    return url;
  }
  const searchParams = urlObject.searchParams;
  keys.forEach((key) => {
    searchParams.delete(key);
  });
  const resultUrl = urlObject.pathname + urlObject.search + urlObject.hash;
  if (isAbsolute) {
    return urlObject.origin + resultUrl;
  }
  return resultUrl;
};
var getQueryParams = (url, baseUrl = BASE_URL) => {
  const urlObject = safeCreateUrl(url, baseUrl);
  if (!urlObject) {
    return {};
  }
  const params = {};
  urlObject.searchParams.forEach((value, key) => {
    if (!Object.prototype.hasOwnProperty.call(params, key)) {
      params[key] = value;
    }
  });
  return params;
};
var getCurrentUrl = () => {
  return window.location.href;
};
var getCurrentPath = () => {
  return window.location.pathname;
};

// src/utils/storage/storage.ts
var StorageService = class {
  // Utilise une implémentation par défaut qui est window.localStorage
  storage;
  isAvailable;
  /**
   * Initialise le service.
   * @param storageStrategy La stratégie de stockage à utiliser (localStorage ou sessionStorage).
   */
  constructor(storageStrategy = "local") {
    this.storage = storageStrategy === "session" ? window.sessionStorage : window.localStorage;
    this.isAvailable = this.checkStorageAvailability(this.storage);
    if (!this.isAvailable) {
      console.warn(
        `Le stockage (${storageStrategy}) n'est pas disponible dans cet environnement.`
      );
    }
  }
  /**
   * Tente de lire une valeur stockée et la désérialise en JSON si possible.
   *
   * @param key La clé de stockage.
   * @returns La valeur désérialisée (objet, chaîne, nombre, booléen) ou null.
   */
  get(key) {
    if (!this.isAvailable) {
      return null;
    }
    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return null;
      }
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error(`Erreur de lecture de la cl\xE9 "${key}" :`, error);
      return null;
    }
  }
  /**
   * Stocke une valeur. Sérialise les objets et les tableaux en JSON.
   *
   * @param key La clé de stockage.
   * @param value La valeur à stocker.
   * @returns True si l'opération a réussi, False sinon.
   */
  set(key, value) {
    if (!this.isAvailable) {
      return false;
    }
    let serializedValue;
    try {
      if (typeof value === "object" && value !== null) {
        serializedValue = JSON.stringify(value);
      } else if (typeof value === "undefined") {
        return true;
      } else {
        serializedValue = String(value);
      }
    } catch (error) {
      console.error(`Erreur de s\xE9rialisation pour la cl\xE9 "${key}" :`, error);
      return false;
    }
    try {
      this.storage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      if (error instanceof DOMException && (error.code === 22 || // Firefox
      error.code === 1014 || // iOS
      error.name === "QuotaExceededError")) {
        console.error(
          `Erreur : Quota de stockage d\xE9pass\xE9 pour la cl\xE9 "${key}".`
        );
      } else {
        console.error(`Erreur de sauvegarde de la cl\xE9 "${key}" :`, error);
      }
      return false;
    }
  }
  /**
   * Supprime un élément du stockage.
   * @param key La clé de l'élément à supprimer.
   */
  remove(key) {
    if (this.isAvailable) {
      this.storage.removeItem(key);
    }
  }
  /**
   * Vide tout le stockage. **À utiliser avec précaution.**
   */
  clear() {
    if (this.isAvailable) {
      this.storage.clear();
    }
  }
  /**
   * Vérifie si l'API de stockage est accessible.
   */
  checkStorageAvailability(storage) {
    const testKey = "__test_storage_key__";
    try {
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};

// src/utils/string.ts
var isJSON = (value) => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};
var capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
var randomStr = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
var sanitize = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-"']/g, "").toLowerCase();
};
var slugify = (str, separator = "-") => {
  return sanitize(str).trim().split(/\s+/).join(separator);
};
var truncate = (str, length) => {
  return str.length > length ? `${str.slice(0, length)}...` : str;
};
var camelCase = (str) => {
  return str.replace(
    /(?:^\w|[A-Z]|\b\w)/g,
    (match, index) => index === 0 ? match.toLowerCase() : match.toUpperCase()
  ).replace(/\s+/g, "");
};
var snakeCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/\s+/g, "_").toLowerCase();
};
var kebabCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/\s+/g, "-").toLowerCase();
};
var isEmpty = (str) => str.trim().length === 0;
var isURL = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};
var isEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};
var escapeHtml = (unsafe) => {
  if (unsafe == null) return "";
  return unsafe.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
var encodeBase64 = (val) => btoa(val);
var decodeBase64 = (val) => atob(val);
export {
  $,
  ANIMATION_DURATION,
  API_TOKEN_COOKIE_NAME,
  APP_WORKSPACE_DATA_SESSION_KEY,
  ApiError,
  BASE_URL,
  BREAKPOINTS,
  DEFAULT_DURATION,
  DEFAULT_FETCH_API_CONFIG,
  DEFAULT_ICON,
  DEFAULT_UPLOADER_OPTIONS,
  DateCalculator,
  DateFormatter,
  FILE_ICON_MAP,
  FILE_TYPES_CONFIG,
  FileSizeFormatter,
  FileUploader,
  FormManager,
  HTTP_STATUS,
  SelectableField,
  StorageService,
  addQueryParams,
  camelCase,
  capitalize,
  convertMarkdownToHtml,
  copyElementContent,
  copyToClipboard,
  copyWithButtonFeedback,
  createApiClient,
  createElement,
  decodeBase64,
  encodeBase64,
  ensureDate,
  escapeHtml,
  fetchAPI,
  fetchDELETE,
  fetchGET,
  fetchPATCH,
  fetchPOST,
  fetchPUT,
  getApiToken,
  getCurrentPath,
  getCurrentUrl,
  getQueryParams,
  handleApiResponse,
  highlightExtension,
  initClipboardHandlers,
  insertElementToDOM,
  isClipboardSupported,
  isEmail,
  isEmpty,
  isJSON,
  isURL,
  kebabCase,
  randomStr,
  removeQueryParams,
  router,
  sanitize,
  slugify,
  snakeCase,
  truncate
};
