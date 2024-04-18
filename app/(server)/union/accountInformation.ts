export type Gender = keyof typeof GENDER;

export const GENDER = {
  male: 'male',
  female: 'female',
  none: 'none',
} as const;
