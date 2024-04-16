export type FAQType = keyof typeof FAQ_TYPE;

export const FAQ_TYPE = {
  account: 'account',
  delivery: 'delivery',
} as const;
