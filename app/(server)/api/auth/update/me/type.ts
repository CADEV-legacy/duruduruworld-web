import { AccountInformationSchema } from '@/(server)/model';

export type AuthUpdateMeRequestBody = Omit<
  AccountInformationSchema,
  '_id' | 'pets' | 'marketingAgreement' | 'deliveredCount' | 'account' | 'createdAt' | 'updatedAt'
>;
