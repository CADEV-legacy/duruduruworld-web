import { AccountInformationSchema, PetSchema } from '@/(server)/model';

export type AuthUpdateMeRequestBody = Omit<
  AccountInformationSchema,
  '_id' | 'pets' | 'marketingAgreement' | 'deliveredCount' | 'account' | 'createdAt' | 'updatedAt'
> & { pets: Array<Omit<PetSchema, '_id'>> };
