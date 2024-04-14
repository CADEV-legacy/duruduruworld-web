import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import mem from 'mem';

import { authRefreshTokenRequest } from '@/(client)/request';
import { authStore } from '@/(client)/store';

import { BASE_ERROR, isBaseError } from '@/(error)';

import { API_URL } from '@/constant';
import { CLIENT_SETTINGS } from '@/setting';

const CONTENT_TYPE_KEY = 'Content-Type' as const;
const CONTENT_TYPE = ['json', 'form', 'multipart'] as const;
const DEFAULT_CONTENT_TYPE = CONTENT_TYPE[0];

type ContentType = (typeof CONTENT_TYPE)[number];

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';

type BaseRequestProps = Pick<
  AxiosRequestConfig,
  | 'baseURL'
  | 'headers'
  | 'url'
  | 'params'
  | 'data'
  | 'responseType'
  | 'onDownloadProgress'
  | 'onUploadProgress'
> & { method: Method; contentType?: ContentType; hasAuth?: boolean };

/** NOTE: Used in only RCC. */
export async function baseRequest<TData>({
  baseURL,
  url,
  headers,
  contentType,
  hasAuth,
  ...restProps
}: BaseRequestProps) {
  try {
    const formattedURL = getFormattedURL(baseURL, url);
    const formattedContentType = getFormattedContentType(contentType);
    const authorizationHeader = hasAuth ? authStore.getState().getAuthorizationHeader() : {};

    return await axios<TData>({
      ...restProps,
      ...formattedURL,
      headers: {
        ...formattedContentType,
        ...authorizationHeader,
        ...headers,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError && error.isAxiosError && error.response) {
      const errorData = error.response.data;

      if (isBaseError(errorData)) {
        throw new BASE_ERROR[errorData.type](errorData);
      }
    }

    throw error;
  }
}

const getFormattedURL = (baseURL?: string, url?: string) => {
  return url?.startsWith('http')
    ? { url }
    : { baseURL: baseURL ?? `${CLIENT_SETTINGS.DOMAIN}${CLIENT_SETTINGS.API_PREFIX}`, url };
};

const getFormattedContentType = (contentType: ContentType = DEFAULT_CONTENT_TYPE) => {
  switch (contentType) {
    case 'json':
      return {
        [CONTENT_TYPE_KEY]: 'application/json',
      };
    case 'form':
      return {
        [CONTENT_TYPE_KEY]: 'application/x-www-form-urlencoded',
      };
    case 'multipart':
      return {
        [CONTENT_TYPE_KEY]: 'multipart/form-data',
      };
    default:
      return {
        [CONTENT_TYPE_KEY]: 'application/json',
      };
  }
};

const getMemorisedRefreshToken = mem(async () => {
  const response = await authRefreshTokenRequest();

  authStore.getState().updateAuth(response.accessToken);
});

axios.interceptors.response.use(
  response => response,
  async error => {
    const {
      config,
      response: { status },
    } = error;

    if (config.url === API_URL.auth.reissueToken || config.url === API_URL.auth.refreshToken) {
      authStore.getState().clearAuth();

      return Promise.reject(error);
    }

    if (config.sent || status !== 401) {
      return Promise.reject(error);
    }

    config.sent = true;

    await getMemorisedRefreshToken();

    return axios(config);
  }
);
