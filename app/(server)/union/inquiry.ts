export type InquiryType = keyof typeof INQUIRY_TYPE;

export const INQUIRY_TYPE = {
  account: 'account',
  delivery: 'delivery',
  etc: 'etc',
} as const;

export type InquiryStatus = keyof typeof INQUIRY_STATUS;

export const INQUIRY_STATUS = {
  pending: 'pending',
  completed: 'completed',
  rejected: 'rejected',
  canceled: 'canceled',
} as const;
