import {
  PetSchema,
  CredentialSchema,
  VerificationSchema,
  AccountInformationSchema,
  AccountSchema,
  KakaoSchema,
} from '@/(server)/model';

export type AuthSignUpRequestBody = Pick<AccountSchema, 'type'>;

export type AuthSignUpCredentialRequestBody = Omit<
  AccountInformationSchema,
  '_id' | 'pets' | 'deliveredCount' | 'account' | 'createdAt' | 'updatedAt'
> &
  Omit<CredentialSchema, '_id' | 'account' | 'createdAt' | 'updatedAt'> &
  Pick<VerificationSchema, 'verificationCode'> & {
    passwordAccept: string;
    pets: Array<Omit<PetSchema, '_id'>>;
  };

export type AuthSignUpKakaoRequestBody = Omit<
  AccountInformationSchema,
  '_id' | 'pets' | 'deliveredCount' | 'account' | 'createdAt' | 'updatedAt'
> &
  Omit<KakaoSchema, '_id' | 'account' | 'createdAt' | 'updatedAt'>;

export type AuthSignUpKakaoResponse = {
  isNeedMoreInformation: boolean;
};

export type CredentialSchemaSelect = Pick<CredentialSchema, '_id'>;

export type VerificationSchemaSelect = Pick<VerificationSchema, 'verificationCode' | 'updatedAt'>;
