import appConfig from '@/config';

import { ApiException } from './apiException';
import { RequestConfig } from './types';
import { Language } from '@/types/user';

const MAX_RETRIES = 3;
const defaultConfig: RequestConfig = { withAuth: true };

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== 'undefined' && value instanceof FormData;

const buildErrorFromResponse = async (
  response: Response,
): Promise<ApiException> => {
  const status = response.status;
  let body: { message?: string } = {};
  try {
    const text = await response.text();
    if (text) body = JSON.parse(text);
  } catch {
    // ignore parse errors, fall back to default messages
  }

  if (status === 400) {
    return new ApiException('bad-request', body.message || 'Invalid request');
  }
  if (status === 401) {
    return new ApiException('unauthorized', 'Authentication required');
  }
  if (status === 403) {
    return new ApiException('forbidden', 'Access denied');
  }
  if (status === 404) {
    return new ApiException('not-found', body.message || 'Resource not found');
  }
  if (status === 422) {
    return new ApiException(
      'validation-error',
      body.message || 'Validation failed',
    );
  }
  if (status >= 500) {
    return new ApiException(
      'server-error',
      'Server error. Please try again later.',
    );
  }
  return new ApiException('unknown-error', 'An unexpected error occurred');
};

export class Api {
  private static _accessToken: string | null;
  private static _lang: Language;

  public async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', url, config);
  }
  public async post<T>(
    url: string,
    data: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>('POST', url, { ...config, data });
  }
  public async put<T>(
    url: string,
    data: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>('PUT', url, { ...config, data });
  }
  public async delete<T>(
    url: string,
    data: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>('DELETE', url, { ...config, data });
  }

  public async uploadFile<T>(
    url: string,
    file: File,
    category: string,
    config?: RequestConfig,
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    return this.request<T>('POST', url, {
      ...config,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  public async request<T>(
    method: Method,
    url: string,
    config?: RequestConfig,
    retry: number = 0,
  ): Promise<T> {
    try {
      const requestConfig = { ...defaultConfig, ...config };
      const headers: Record<string, string> = { ...requestConfig.headers };

      if (requestConfig.withAuth) {
        if (!Api._accessToken)
          throw new ApiException('missing-user-token', 'Missing user token');
        headers.Authorization = `Bearer ${Api._accessToken}`;
      }

      headers['Accept-Language'] = Api._lang || 'en';

      let body: BodyInit | undefined;
      if (requestConfig.data !== undefined) {
        if (isFormData(requestConfig.data)) {
          body = requestConfig.data;
        } else {
          const hasContentType = Object.keys(headers).some(
            (k) => k.toLowerCase() === 'content-type',
          );
          if (!hasContentType) {
            headers['Content-Type'] = 'application/json';
          }
          if (headers['Content-Type'] === 'application/json') {
            body = JSON.stringify(requestConfig.data);
          } else {
            body = requestConfig.data as BodyInit;
          }
        }
      }

      const fullUrl = (() => {
        const apiUrl = appConfig.apiUrl.endsWith('/')
          ? appConfig.apiUrl.slice(0, -1)
          : appConfig.apiUrl;
        const urlPath = url.startsWith('/') ? url : `/${url}`;

        const base = url.startsWith('http') ? url : `${apiUrl}${urlPath}`;
        if (!requestConfig.params) return base;
        const usp = new URLSearchParams();
        for (const [key, value] of Object.entries(requestConfig.params)) {
          if (value === undefined || value === null) continue;
          usp.append(key, String(value));
        }
        const qs = usp.toString();
        return qs ? `${base}?${qs}` : base;
      })();

      const fetchInit: RequestInit = {
        method,
        headers,
        credentials: 'same-origin',
      };
      if (body !== undefined) fetchInit.body = body;

      console.log(`API Request: ${method} ${fullUrl}`, fetchInit);
      const response = await fetch(fullUrl, fetchInit);

      if (!response.ok) {
        throw await buildErrorFromResponse(response);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const text = await response.text();
      if (!text) {
        return undefined as T;
      }
      return JSON.parse(text) as T;
    } catch (err: unknown) {
      if (
        err instanceof ApiException &&
        err.errorCode === 'missing-user-token' &&
        retry < MAX_RETRIES
      ) {
        await new Promise((resolve) =>
          setTimeout(() => resolve(undefined), (retry + 1) * 1000),
        );
        return this.request<T>(method, url, config, retry + 1);
      }
      throw err;
    }
  }

  public static setAccessToken(token: string) {
    this._accessToken = token;
    console.log(token);
  }

  public static clearAccessToken() {
    this._accessToken = null;
  }

  public static setLanguage(language: Language) {
    this._lang = language;
  }
}
