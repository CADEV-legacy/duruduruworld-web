export type PetType = keyof typeof PET_TYPE;

export const PET_TYPE = {
  dog: 'dog',
} as const;
