import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  fetchAPI,
  fetchGET,
  fetchPOST,
  fetchPUT,
  fetchPATCH,
  fetchDELETE,
  getApiToken,
  handleApiResponse,
} from './fetch';
import { ApiError } from './api-error';

vi.mock('axios', () => {
  const mockAxios: any = vi.fn();
  mockAxios.isCancel = vi.fn().mockReturnValue(false);
  return { default: mockAxios };
});

vi.mock('@/utils/storage/cookies', () => ({
  CookieHelper: {
    get: vi.fn().mockReturnValue(null),
  },
}));

vi.mock('@/constants/index.ts', () => ({
  API_TOKEN_COOKIE_NAME: '__test_token',
}));

vi.mock('@/config/fetch', () => ({
  DEFAULT_FETCH_API_CONFIG: {
    timeout: 5000,
    retries: 0,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
}));

describe('fetchAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('effectue une requête GET avec succès', async () => {
    const mockData = { id: 1, name: 'Test' };
    (axios as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      statusText: 'OK',
      data: JSON.stringify(mockData),
      headers: { 'content-type': 'application/json' },
    });

    const result = await fetchAPI('/api/test');
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockData);
  });

  it('lance une ApiError pour une réponse non-2xx', async () => {
    (axios as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 404,
      statusText: 'Not Found',
      data: JSON.stringify({ message: 'Not found' }),
      headers: {},
    });

    await expect(fetchAPI('/api/missing')).rejects.toThrow(ApiError);
  });

  it('lance une ApiError pour une erreur réseau', async () => {
    (axios as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Network Error'),
    );

    await expect(fetchAPI('/api/test', { retries: 0 } as any)).rejects.toThrow(
      ApiError,
    );
  });
});

describe('fetchGET', () => {
  beforeEach(() => vi.clearAllMocks());

  it('appelle fetchAPI avec method GET', async () => {
    (axios as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      statusText: 'OK',
      data: '{}',
      headers: {},
    });

    const result = await fetchGET('/api/data');
    expect(result.ok).toBe(true);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET' }),
    );
  });
});

describe('fetchPOST', () => {
  beforeEach(() => vi.clearAllMocks());

  it('appelle fetchAPI avec method POST et body', async () => {
    (axios as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 201,
      statusText: 'Created',
      data: '{"id":1}',
      headers: {},
    });

    const result = await fetchPOST('/api/data', { name: 'test' });
    expect(result.ok).toBe(true);
    expect(result.status).toBe(201);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST' }),
    );
  });
});

describe('handleApiResponse', () => {
  beforeEach(() => vi.clearAllMocks());

  it('appelle onSuccess avec les données en cas de succès', async () => {
    const onSuccess = vi.fn();
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      data: { id: 1 },
      text: '{"id":1}',
      blob: new Blob(),
    };

    const result = await handleApiResponse(
      Promise.resolve(mockResponse),
      onSuccess,
    );
    expect(onSuccess).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual({ id: 1 });
  });

  it("appelle onError en cas d'ApiError", async () => {
    const onError = vi.fn();
    const apiError = new ApiError(500, 'Error', 'fail', new Response());

    const result = await handleApiResponse(
      Promise.reject(apiError),
      undefined,
      onError,
    );
    expect(onError).toHaveBeenCalledWith(apiError);
    expect(result).toBeNull();
  });

  it('retourne null pour une erreur inattendue', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await handleApiResponse(
      Promise.reject(new Error('unexpected')),
    );
    expect(result).toBeNull();
    consoleSpy.mockRestore();
  });
});

describe('getApiToken', () => {
  it("retourne null quand aucun cookie n'est défini", () => {
    expect(getApiToken()).toBeNull();
  });
});
