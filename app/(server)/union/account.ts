export type AccountType = keyof typeof ACCOUNT_TYPE;

export const ACCOUNT_TYPE = {
  credentials: 'credentials',
  kakao: 'kakao',
} as const;

export type AccountStatus = keyof typeof ACCOUNT_STATUS;

export const ACCOUNT_STATUS = {
  pending: 'pending',
  active: 'active',
  inactive: 'inactive',
  withdrew: 'withdrew',
} as const;
