import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import config from '@/config';

import { ApiException } from './apiException';
import { RequestConfig } from './types';
import { Language } from '@/types/user';

const MAX_RETRIES = 3;
const defaultConfig: RequestConfig = { withAuth: true };

export class Api {
  private static _accessToken: string | null;
  private static _lang: Language;

  private _axiosInstance: AxiosInstance;

  constructor() {
    this._axiosInstance = axios.create({
      baseURL: config.apiUrl,
      withCredentials: true,
    });

    this._axiosInstance.interceptors.request.use((config) => {
      const language = Api._lang || 'en';
      config.headers['Accept-Language'] = language;
      return config;
    });

    this._axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        let errorCode = 'unknown-error';
        let message = 'An unexpected error occurred';

        if (status === 400) {
          errorCode = 'bad-request';
          message = error.response?.data?.message || 'Invalid request';
        } else if (status === 401) {
          errorCode = 'unauthorized';
          message = 'Authentication required';
        } else if (status === 403) {
          errorCode = 'forbidden';
          message = 'Access denied';
        } else if (status === 404) {
          errorCode = 'not-found';
          message = error.response?.data?.message || 'Resource not found';
        } else if (status === 422) {
          errorCode = 'validation-error';
          message = error.response?.data?.message || 'Validation failed';
        } else if (status && status >= 500) {
          errorCode = 'server-error';
          message = 'Server error. Please try again later.';
        } else if (!error.response) {
          errorCode = 'network-error';
          message = 'Network error. Please check your connection.';
        }

        return Promise.reject(new ApiException(errorCode, message));
      },
    );
  }

  public async get<T>(url: string, config?: RequestConfig) {
    return this.request<T>('GET', url, config);
  }
  public async post<T>(url: string, data: unknown, config?: RequestConfig) {
    return this.request<T>('POST', url, { ...config, data });
  }
  public async put<T>(url: string, data: unknown, config?: RequestConfig) {
    return this.request<T>('PUT', url, { ...config, data });
  }
  public async delete<T>(url: string, data: unknown, config?: RequestConfig) {
    return this.request<T>('DELETE', url, { ...config, data });
  }

  public async uploadFile<T>(
    url: string,
    file: File,
    category: string,
    config?: RequestConfig,
  ) {
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
    method: string,
    url: string,
    config?: RequestConfig,
    retry: number = 0,
  ): Promise<T> {
    try {
      const requestConfig = { ...defaultConfig, ...config };
      const headers: Record<string, string> = {};

      if (false && requestConfig.withAuth) {
        if (!Api._accessToken)
          throw new ApiException('missing-user-token', 'Missing user token');
        headers.Authorization = `Bearer ${Api._accessToken}`;
      }

      const response = await this._axiosInstance.request<T>({
        method,
        url,
        headers,
        ...requestConfig,
      });
      return response.data;
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
      } else {
        throw err;
      }
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
