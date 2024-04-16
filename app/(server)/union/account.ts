export type AccountStatus = keyof typeof ACCOUNT_STATUS;

export const ACCOUNT_STATUS = {
  pending: 'pending',
  active: 'active',
  inactive: 'inactive',
  withdrew: 'withdrew',
} as const;
