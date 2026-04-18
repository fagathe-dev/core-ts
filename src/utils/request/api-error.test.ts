import { describe, it, expect } from 'vitest';
import { ApiError } from './api-error';

describe('ApiError', () => {
  const createMockResponse = (status = 400, statusText = 'Bad Request') =>
    new Response(null, { status, statusText });

  it('est une instance de Error', () => {
    const error = new ApiError(400, 'Bad Request', 'Test', createMockResponse());
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });

  it('a les propriétés correctes', () => {
    const response = createMockResponse(404, 'Not Found');
    const error = new ApiError(404, 'Not Found', 'Resource missing', response, {
      message: 'Not found',
    });

    expect(error.status).toBe(404);
    expect(error.statusText).toBe('Not Found');
    expect(error.message).toBe('Resource missing');
    expect(error.ok).toBe(false);
    expect(error.name).toBe('ApiError');
    expect(error.data).toEqual({ message: 'Not found' });
  });

  describe('isStatus', () => {
    it('retourne true pour le status correspondant', () => {
      const error = new ApiError(403, 'Forbidden', '', createMockResponse(403));
      expect(error.isStatus(403)).toBe(true);
    });

    it('retourne false pour un status différent', () => {
      const error = new ApiError(403, 'Forbidden', '', createMockResponse(403));
      expect(error.isStatus(404)).toBe(false);
    });
  });

  describe('isClientError', () => {
    it('retourne true pour les erreurs 4xx', () => {
      expect(new ApiError(400, '', '', createMockResponse()).isClientError()).toBe(true);
      expect(new ApiError(404, '', '', createMockResponse()).isClientError()).toBe(true);
      expect(new ApiError(499, '', '', createMockResponse()).isClientError()).toBe(true);
    });

    it('retourne false pour les erreurs 5xx', () => {
      expect(new ApiError(500, '', '', createMockResponse()).isClientError()).toBe(false);
    });

    it('retourne false pour les succès 2xx', () => {
      expect(new ApiError(200, '', '', createMockResponse()).isClientError()).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('retourne true pour les erreurs 5xx', () => {
      expect(new ApiError(500, '', '', createMockResponse()).isServerError()).toBe(true);
      expect(new ApiError(503, '', '', createMockResponse()).isServerError()).toBe(true);
    });

    it('retourne false pour les erreurs 4xx', () => {
      expect(new ApiError(400, '', '', createMockResponse()).isServerError()).toBe(false);
    });
  });

  describe('isNetworkError', () => {
    it('retourne true pour status 0', () => {
      expect(new ApiError(0, '', '', createMockResponse()).isNetworkError()).toBe(true);
    });

    it('retourne false pour status non-0', () => {
      expect(new ApiError(500, '', '', createMockResponse()).isNetworkError()).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('retourne le message du data si disponible', () => {
      const error = new ApiError(400, '', 'fallback', createMockResponse(), {
        message: 'Custom error',
      });
      expect(error.getErrorMessage()).toBe('Custom error');
    });

    it('retourne le message de l\'erreur si data n\'a pas de message', () => {
      const error = new ApiError(400, '', 'fallback', createMockResponse(), {
        code: 'ERR',
      });
      expect(error.getErrorMessage()).toBe('fallback');
    });

    it('retourne le message de l\'erreur si data est undefined', () => {
      const error = new ApiError(400, '', 'fallback', createMockResponse());
      expect(error.getErrorMessage()).toBe('fallback');
    });
  });

  describe('getValidationErrors', () => {
    it('retourne les erreurs de validation si disponibles', () => {
      const errors = { email: 'Invalid', name: ['Required', 'Too short'] };
      const error = new ApiError(422, '', '', createMockResponse(), {
        message: 'Validation failed',
        errors,
      });
      expect(error.getValidationErrors()).toEqual(errors);
    });

    it('retourne null si pas d\'erreurs de validation', () => {
      const error = new ApiError(400, '', '', createMockResponse(), {
        message: 'Error',
      });
      expect(error.getValidationErrors()).toBeNull();
    });

    it('retourne null si data est undefined', () => {
      const error = new ApiError(400, '', '', createMockResponse());
      expect(error.getValidationErrors()).toBeNull();
    });
  });
});
