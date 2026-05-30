import axios from 'axios';
import { toast } from 'sonner';
<<<<<<< HEAD
import {
  AuthenticationApi,
  FeedApi,
  FollowApi,
  HobbyApi,
  HobbySessionApi,
  UserApi,
} from './generated';
=======
import { AuthenticationApi, HobbyApi, UserApi } from './generated';
>>>>>>> 27afad7 ([feature/user-dropdown] feat(ux): add sonner toast notifications for async actions and fixed some errors)
import type { PostAuthLogin200Response } from './generated';

export * from './generated';

export interface ApiClientError {
  message: string;
  cause?: string | null;
  status?: number;
}

type UnauthorizedHandler = ((requestUrl: string) => void) | null;

const API_BASE_URL: string =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

export const apiHttpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let unauthorizedHandler: UnauthorizedHandler = null;

export const setUnauthorizedHandler = (handler: UnauthorizedHandler) => {
  unauthorizedHandler = handler;
};

export const getCurrentUser = async (): Promise<PostAuthLogin200Response> => {
  try {
    const response =
      await apiHttpClient.get<PostAuthLogin200Response>('/auth/me');
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

apiHttpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const { data, status } = error.response ?? {};
      const requestUrl = error.config?.url ?? '';

      if (status === 401) {
        unauthorizedHandler?.(requestUrl);
      }

      // Show a toast for failed requests unless the caller suppressed it
      try {
        const suppressed =
          (error.config as any)?.headers?.['x-toast-suppressed'] === '1';
        const toastId = `${error.config?.method ?? 'req'}:${String(error.config?.url ?? '')}`;
        const message =
          typeof data === 'string'
            ? data
            : data && typeof data === 'object' && 'message' in data
              ? (data as any).message
              : error.message || 'Request failed';

        if (!suppressed) {
          toast.error(String(message ?? 'Request failed'), { id: toastId });
        }
      } catch {
        // swallow toast errors
      }

      if (typeof data === 'string') {
        return Promise.reject({
          message: data,
          status,
          cause: null,
        } satisfies ApiClientError);
      }

      if (data && typeof data === 'object') {
        // Zod-like validation shape: { data: {...}, error: [{ path, message, ... }], success: false }
        if (Array.isArray(data.error)) {
          const messages = data.error.map((err: any) => {
            const path = Array.isArray(err.path)
              ? err.path.join('.')
              : String(err.path ?? '');
            const msg = err.message ?? JSON.stringify(err);
            return path ? `${path}: ${msg}` : msg;
          });

          return Promise.reject({
            message: messages.join('; '),
            status,
            cause: null,
          } satisfies ApiClientError);
        }

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
export const hobbySessionApiClient = new HobbySessionApi(
  undefined,
  API_BASE_URL,
  apiHttpClient,
);
export const feedApiClient = new FeedApi(
  undefined,
  API_BASE_URL,
  apiHttpClient,
);
export const followApiClient = new FollowApi(
  undefined,
  API_BASE_URL,
  apiHttpClient,
);
export const userApiClient = new UserApi(
  undefined,
  API_BASE_URL,
  apiHttpClient,
);
