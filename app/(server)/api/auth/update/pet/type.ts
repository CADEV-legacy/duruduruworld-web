import { PetSchema } from '@/(server)/model';

export type AuthUpdatePetRequestBody = {
  pets: Omit<PetSchema, '_id' | 'createdAt' | 'updatedAt'>[];
};
