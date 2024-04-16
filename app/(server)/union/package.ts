export type DeliveryCompany = keyof typeof DELIVERY_COMPANY;

export const DELIVERY_COMPANY = {
  cj: 'cj',
} as const;

export type PackageStatus = keyof typeof PACKAGE_STATUS;

export const PACKAGE_STATUS = {
  assigned: 'assigned',
  receipt: 'receipt',
  delivered: 'delivered',
  arrived: 'arrived',
  returned: 'returned',
} as const;
