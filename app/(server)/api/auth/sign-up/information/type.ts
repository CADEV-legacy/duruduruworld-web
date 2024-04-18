import { AccountInformationSchema, AccountSchema, PetSchema } from '@/(server)/model';

export type AuthSignUpInformationRequestBody = Pick<AccountSchema, 'type'> &
  Omit<
    AccountInformationSchema,
    '_id' | 'pets' | 'deliveredCount' | 'account' | 'createdAt' | 'updatedAt'
  > & { pets: Array<Omit<PetSchema, '_id'>> };

export type AccountSchemaSelect = Pick<AccountSchema, 'kakao' | 'information' | 'status'>;
