export type AdminAuthority = keyof typeof ADMIN_AUTHORITY;

export const ADMIN_AUTHORITY = {
  super: 'super',
  sub: 'sub',
  normal: 'normal',
} as const;
