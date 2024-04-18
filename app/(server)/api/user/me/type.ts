import { AccountInformationSchema, AccountSchema, PetSchema } from '@/(server)/model';

export type UserMeResponse = {
  account: AccountSchemaSelect;
  information: Omit<AccountInformationSchemaSelect, 'pets'>;
  pets: PetSchemaSelect[];
};

export type AccountSchemaSelect = Pick<AccountSchema, 'type' | 'status' | 'createdAt'>;

export type AccountInformationSchemaSelect = Omit<
  AccountInformationSchema,
  '_id' | 'account' | 'createdAt' | 'updatedAt'
>;

export type PetSchemaSelect = Omit<PetSchema, '_id' | 'createdAt' | 'updatedAt'>;
