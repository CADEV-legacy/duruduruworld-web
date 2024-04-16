export type InquiryType = keyof typeof INQUIRY_TYPE;

export const INQUIRY_TYPE = {
  account: 'account',
  delivery: 'delivery',
  etc: 'etc',
} as const;
