const DEFAULT_ENVIRONMENT = 'development';
const DEFAULT_DOMAIN = 'localhost:3000';
const DEFAULT_SOCKET_SERVER_DOMAIN = 'http://localhost:8000';
const DEFAULT_API_PREFIX = '/api';

/**
 * NOTE: Server Settings
 * - ENVIRONMENT, DOMAIN, API_PREFIX has default setting.
 */
export const SERVER_SETTINGS = {
  ENVIRONMENT: process.env.ENVIRONMENT ?? DEFAULT_ENVIRONMENT,
  DOMAIN: process.env.DOMAIN ?? DEFAULT_DOMAIN,
  SOCKER_SERVER_DOMAIN: process.env.SOCKET_SERVER_DOMAIN ?? DEFAULT_SOCKET_SERVER_DOMAIN,
  API_PREFIX: process.env.API_PREFIX ?? DEFAULT_API_PREFIX,
  DATABASE_URL: process.env.DATABASE_URL,
  CRYPTION_SALT_ROUND: process.env.CRYPTION_SALT_ROUND,
  ACCESS_TOKEN_JWT_SECRET: process.env.ACCESS_TOKEN_JWT_SECRET,
  REFRESH_TOKEN_JWT_SECRET: process.env.REFRESH_TOKEN_JWT_SECRET,
  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,
  NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID: process.env.NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID,
  NAVER_CLOUD_PLATFORM_SECRET_KEY: process.env.NAVER_CLOUD_PLATFORM_SECRET_KEY,
  NAVER_CLOUD_PLATFORM_SENS_SERVICE_ID: process.env.NAVER_CLOUD_PLATFORM_SENS_SERVICE_ID,
  NAVER_CLOUD_PLATFORM_SENS_SERVICE_PHONENUMBER:
    process.env.NAVER_CLOUD_PLATFORM_SENS_SERVICE_PHONENUMBER,
} as const;

/**
 * NOTE: Client Settings
 * - ENVIRONMENT, DOMAIN, API_PREFIX has default setting.
 */
export const CLIENT_SETTINGS = {
  ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT ?? DEFAULT_ENVIRONMENT,
  DOMAIN: process.env.NEXT_PUBLIC_DOMAIN ?? DEFAULT_DOMAIN,
  SOCKER_SERVER_DOMAIN:
    process.env.NEXT_PUBLIC_SOCKER_SERVER_DOMAIN ?? DEFAULT_SOCKET_SERVER_DOMAIN,
  API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX ?? DEFAULT_API_PREFIX,
} as const;
