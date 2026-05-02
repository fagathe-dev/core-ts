import axios, { AxiosRequestConfig } from 'axios';
import { API_TOKEN_COOKIE_NAME } from '../../constants/index';
import type { FetchResponse, RequestOptions } from '../../types';
import { ApiError } from './api-error';
import { CookieHelper } from '../storage/cookies';
import { DEFAULT_FETCH_API_CONFIG } from '../../config/fetch';

/**
 * Récupère directement le token API depuis les cookies.
 *
 * @returns Le token API (__ffr_v.aoth) ou null.
 */
export const getApiToken = (): string | null =>
  CookieHelper.get(API_TOKEN_COOKIE_NAME);

// Extension du type RequestOptions pour inclure nos paramètres personnalisés
// (Support de onUploadProgress pour Axios sans casser la signature)
export interface AuthenticatedRequestOptions extends RequestOptions {
  isAPIAuthenticated?: boolean;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  responseType?:
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';
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
export const fetchAPI = async <T = any>(
  url: string,
  options: RequestInit & AuthenticatedRequestOptions = {},
): Promise<FetchResponse<T>> => {
  const {
    timeout = DEFAULT_FETCH_API_CONFIG.timeout,
    retries = DEFAULT_FETCH_API_CONFIG.retries,
    isAPIAuthenticated = false,
    onUploadProgress,
    onDownloadProgress,
    responseType,
    ...requestOptions
  } = options;

  // Handle body serialization automatically (Conservation de ta logique exacte)
  let bodyData = requestOptions.body;

  if (
    bodyData &&
    typeof bodyData === 'object' &&
    !(bodyData instanceof FormData) &&
    !(bodyData instanceof URLSearchParams) &&
    !(bodyData instanceof Blob) &&
    !(bodyData instanceof ArrayBuffer) &&
    typeof bodyData !== 'string'
  ) {
    bodyData = JSON.stringify(bodyData);
  }

  // Set default headers
  const headers: Record<string, string> = {
    ...DEFAULT_FETCH_API_CONFIG.headers,
    ...(requestOptions.headers as Record<string, string>),
  };

  // Axios n'aime pas le header application/json forcé si les données sont un FormData
  // (Sinon le navigateur ne peut pas générer le boundary automatiquement)
  if (
    bodyData instanceof FormData &&
    headers['Content-Type'] === 'application/json'
  ) {
    delete headers['Content-Type'];
  }

  // --- LOGIQUE D'AUTHENTIFICATION API TOKEN ---
  if (isAPIAuthenticated) {
    const apiToken = getApiToken();
    if (apiToken) {
      headers['X-AUTH-TOKEN'] = apiToken;
    } else {
      console.warn(
        `Token API (${API_TOKEN_COOKIE_NAME}) manquant pour une requête authentifiée vers ${url}`,
      );
    }
  }
  // ------------------------------------------

  let lastError: any;

  // BOUCLE DE RETRY
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const axiosConfig: AxiosRequestConfig = {
        url,
        method: requestOptions.method || 'GET',
        headers,
        data: bodyData, // Axios utilise "data" là où fetch utilise "body"
        signal: controller.signal,
        onUploadProgress,
        onDownloadProgress,
        responseType: responseType || 'text', // On force texte pour simuler response.text() du fetch
        validateStatus: () => true, // Ne pas throw d'erreur Axios pour laisser l'ApiError prendre le relais
      };

      const response = await axios(axiosConfig);
      clearTimeout(timeoutId);

      let textContent = '';
      let data: T;
      let blob: Blob;

      if (response.data instanceof Blob) {
        blob = response.data;
        data = {} as T;
      } else {
        textContent =
          typeof response.data === 'string'
            ? response.data
            : JSON.stringify(response.data);
        blob = new Blob([textContent]); // Fallback propre
        try {
          data = textContent ? JSON.parse(textContent) : ({} as T);
        } catch (e) {
          data = {} as T;
        }
      }

      // Re-créer des Headers "type fetch" pour la rétrocompatibilité
      const fetchHeaders = new Headers();
      if (response.headers) {
        Object.entries(response.headers).forEach(([key, value]) => {
          if (typeof value === 'string') fetchHeaders.append(key, value);
          else if (Array.isArray(value))
            value.forEach((v) => fetchHeaders.append(key, String(v)));
        });
      }

      const isOk = response.status >= 200 && response.status < 300;

      // On simule une Response Native Fetch pour l'injecter dans ton objet ApiError
      const nativeResponse = new Response(
        response.data instanceof Blob ? response.data : textContent,
        {
          status: response.status,
          statusText: response.statusText,
          headers: fetchHeaders,
        },
      );

      // Create the response object
      const apiResponse: FetchResponse<T> = {
        ok: isOk,
        headers: fetchHeaders,
        status: response.status,
        statusText: response.statusText,
        data,
        text: textContent,
        blob,
      };

      // Exactement ta même logique de rejet avec ApiError
      if (!isOk) {
        throw new ApiError<T>(
          response.status,
          response.statusText,
          typeof data === 'object' && data && 'message' in data
            ? String((data as any).message)
            : `Request failed with status ${response.status}`,
          nativeResponse,
          data,
        );
      }

      return apiResponse; // SUCCÈS TOTAL : on sort de la fonction
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      // Si c'est une erreur d'annulation manuelle (pas timeout), on ne retry pas
      if (axios.isCancel(error) && !controller.signal.aborted) {
        break;
      }

      if (attempt < retries) {
        continue;
      }
    }
  }

  // --- GESTION DE L'ERREUR FINALE (après tous les retries) ---

  if (lastError instanceof ApiError) {
    throw lastError;
  }

  // Handle timeout specifically
  if (
    axios.isCancel(lastError) ||
    (lastError instanceof DOMException && lastError.name === 'AbortError')
  ) {
    throw new ApiError(
      408,
      'Request Timeout',
      `Request timed out after ${timeout}ms (${retries + 1} attempts)`,
      new Response(),
      { message: 'Request Timeout' } as T,
    );
  }

  // Handle network errors or other failures
  throw new ApiError(
    0,
    'Network Error',
    lastError instanceof Error ? lastError.message : 'Unknown error occurred',
    new Response(),
    { message: 'Network Error' } as T,
  );
};

/**
 * HTTP GET request
 */
export const fetchGET = async <T = any>(
  url: string,
  options: Omit<AuthenticatedRequestOptions, 'method' | 'body'> = {},
): Promise<FetchResponse<T>> => {
  return fetchAPI<T>(url, { ...options, method: 'GET' });
};

/**
 * HTTP POST request
 */
export const fetchPOST = async <T = any>(
  url: string,
  body?: any,
  options: Omit<AuthenticatedRequestOptions, 'method' | 'body'> = {},
): Promise<FetchResponse<T>> => {
  const requestOptions: RequestInit & AuthenticatedRequestOptions = {
    ...options,
    method: 'POST',
  };

  if (body !== undefined) {
    requestOptions.body = body;
  }

  return fetchAPI<T>(url, requestOptions);
};

/**
 * HTTP PUT request
 */
export const fetchPUT = async <T = any>(
  url: string,
  body?: any,
  options: Omit<AuthenticatedRequestOptions, 'method' | 'body'> = {},
): Promise<FetchResponse<T>> => {
  const requestOptions: RequestInit & AuthenticatedRequestOptions = {
    ...options,
    method: 'PUT',
  };

  if (body !== undefined) {
    requestOptions.body = body;
  }

  return fetchAPI<T>(url, requestOptions);
};

/**
 * HTTP PATCH request
 */
export const fetchPATCH = async <T = any>(
  url: string,
  body?: any,
  options: Omit<AuthenticatedRequestOptions, 'method' | 'body'> = {},
): Promise<FetchResponse<T>> => {
  const requestOptions: RequestInit & AuthenticatedRequestOptions = {
    ...options,
    method: 'PATCH',
  };

  if (body !== undefined) {
    requestOptions.body = body;
  }

  return fetchAPI<T>(url, requestOptions);
};

/**
 * HTTP DELETE request
 */
export const fetchDELETE = async <T = any>(
  url: string,
  options: Omit<AuthenticatedRequestOptions, 'method' | 'body'> = {},
): Promise<FetchResponse<T>> => {
  return fetchAPI<T>(url, { ...options, method: 'DELETE' });
};

/**
 * Utility function to handle API responses with error handling
 */
export const handleApiResponse = async <T = any>(
  responsePromise: Promise<FetchResponse<T>>,
  onSuccess?: (data: T) => void,
  onError?: (error: ApiError) => void,
): Promise<T | null> => {
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
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

/**
 * Create a configured fetch client with base URL and default options
 */
export const createApiClient = (
  baseURL: string,
  defaultOptions: AuthenticatedRequestOptions = {},
) => {
  return {
    get: <T = any>(
      endpoint: string,
      options: Omit<AuthenticatedRequestOptions, 'method' | 'body'> = {},
    ) =>
      fetchGET<T>(`${baseURL}${endpoint}`, {
        ...defaultOptions,
        ...options,
      }),

    post: <T = any>(
      endpoint: string,
      body?: any,
      options: Omit<AuthenticatedRequestOptions, 'method' | 'body'> = {},
    ) =>
      fetchPOST<T>(`${baseURL}${endpoint}`, body, {
        ...defaultOptions,
        ...options,
      }),

    put: <T = any>(
      endpoint: string,
      body?: any,
      options: Omit<AuthenticatedRequestOptions, 'method' | 'body'> = {},
    ) =>
      fetchPUT<T>(`${baseURL}${endpoint}`, body, {
        ...defaultOptions,
        ...options,
      }),

    patch: <T = any>(
      endpoint: string,
      body?: any,
      options: Omit<AuthenticatedRequestOptions, 'method' | 'body'> = {},
    ) =>
      fetchPATCH<T>(`${baseURL}${endpoint}`, body, {
        ...defaultOptions,
        ...options,
      }),

    delete: <T = any>(
      endpoint: string,
      options: Omit<AuthenticatedRequestOptions, 'method' | 'body'> = {},
    ) =>
      fetchDELETE<T>(`${baseURL}${endpoint}`, {
        ...defaultOptions,
        ...options,
      }),
  };
};
