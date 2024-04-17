export type AccountStatus = keyof typeof ACCOUNT_STATUS;

export const ACCOUNT_STATUS = {
  pending: 'pending',
  active: 'active',
  inactive: 'inactive',
  withdrew: 'withdrew',
} as const;

export type AccountType = keyof typeof ACCOUNT_TYPE;

export const ACCOUNT_TYPE = {
  credential: 'credential',
  kakao: 'kakao',
} as const;
