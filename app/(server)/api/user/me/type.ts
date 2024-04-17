import { AccountInformationSchema, AccountSchema, PetSchema } from '@/(server)/model';

export type UserMeResponse = Pick<AccountSchema, 'type' | 'status' | 'createdAt'> & {
  information: Omit<
    AccountInformationSchema,
    '_id' | 'pets' | 'account' | 'createdAt' | 'updatedAt'
  >;
  pets: Array<Omit<PetSchema, '_id'>>;
};
