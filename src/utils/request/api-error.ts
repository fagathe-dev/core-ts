// public/ts/utils/request/api-error.ts : classe ApiError pour gérer les erreurs d'API de `fetch`

import type { ApiErrorData } from '@/types/index.d';

/**
 * Custom error class for API request failures
 * @template T The type of data expected in the error response
 */
export class ApiError<T = ApiErrorData> extends Error {
  public readonly ok: boolean = false;
  public readonly headers: Headers;
  public readonly status: number;
  public readonly statusText: string;
  public readonly data: T;
  public readonly response: Response;

  constructor(
    status: number,
    statusText: string,
    message: string,
    response: Response,
    data?: T,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.headers = response.headers;
    this.data = data as T;
  }

  /**
   * Check if the error is a specific HTTP status
   */
  public isStatus(status: number): boolean {
    return this.status === status;
  }

  /**
   * Check if the error is a client error (4xx)
   */
  public isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if the error is a server error (5xx)
   */
  public isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  /**
   * Check if the error is a network error (status 0)
   */
  public isNetworkError(): boolean {
    return this.status === 0;
  }

  /**
   * Get error message from data if available
   */
  public getErrorMessage(): string {
    if (typeof this.data === 'object' && this.data && 'message' in this.data) {
      return String(this.data.message);
    }
    return this.message;
  }

  /**
   * Get validation errors if available
   */
  public getValidationErrors(): Record<string, string | string[]> | null {
    if (typeof this.data === 'object' && this.data && 'errors' in this.data) {
      return this.data.errors as Record<string, string | string[]>;
    }
    return null;
  }
}
