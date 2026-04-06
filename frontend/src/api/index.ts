import axios from 'axios';
import { AuthenticationApi, HobbyApi, UserApi } from './generated';

export interface ApiClientError {
  message: string;
  cause?: string | null;
  status?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

const apiHttpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiHttpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const { data, status } = error.response ?? {};

      if (typeof data === 'string') {
        return Promise.reject({
          message: data,
          status,
          cause: null,
        } satisfies ApiClientError);
      }

      if (data && typeof data === 'object') {
        return Promise.reject(data);
      }

      return Promise.reject({
        message: error.message || 'Request failed',
        status,
        cause: error.code ?? null,
      } satisfies ApiClientError);
    }

    return Promise.reject({
      message: 'Unexpected request error',
      cause: null,
    } satisfies ApiClientError);
  },
);

export const authApiClient = new AuthenticationApi(
  undefined,
  API_BASE_URL,
  apiHttpClient,
);
export const hobbyApiClient = new HobbyApi(
  undefined,
  API_BASE_URL,
  apiHttpClient,
);
export const userApiClient = new UserApi(
  undefined,
  API_BASE_URL,
  apiHttpClient,
);

// Backward-compatible alias
export const authApi = authApiClient;
