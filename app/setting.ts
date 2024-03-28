const DEFAULT_ENVIRONMENT = 'development';
const DEFAULT_DOMAIN = 'localhost:3000';
const DEFAULT_API_PREFIX = '/api';

/**
 * NOTE: Server Settings
 * - ENVIRONMENT, DOMAIN, API_PREFIX has default setting.
 */
export const SERVER_SETTINGS = {
  ENVIRONMENT: process.env.ENVIRONMENT ?? DEFAULT_ENVIRONMENT,
  DOMAIN: process.env.DOMAIN ?? DEFAULT_DOMAIN,
  API_PREFIX: process.env.API_PREFIX ?? DEFAULT_API_PREFIX,
  DATABASE_URL: process.env.DATABASE_URL,
  API_URL: process.env.API_URL,
  CRYPTION_SALT_ROUND: process.env.CRYPTION_SALT_ROUND,
  ACCESS_TOKEN_JWT_SECRET: process.env.ACCESS_TOKEN_JWT_SECRET,
  REFRESH_TOKEN_JWT_SECRET: process.env.REFRESH_TOKEN_JWT_SECRET,
  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,
} as const;

/**
 * NOTE: Client Settings
 * - ENVIRONMENT, DOMAIN, API_PREFIX has default setting.
 */
export const CLIENT_SETTINGS = {
  ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT ?? DEFAULT_ENVIRONMENT,
  DOMAIN: process.env.NEXT_PUBLIC_DOMAIN ?? DEFAULT_DOMAIN,
  API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX ?? DEFAULT_API_PREFIX,
} as const;
