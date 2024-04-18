import { CredentialSchema, VerificationSchema } from '@/(server)/model';

export type AuthFindMyIdentifierRequestSearchParams = {
  phoneNumber: string;
  verificationCode: string;
};

export type AuthFindMyIdentifierResponse = {
  identifier: string;
};

export type CredentialSchemaSelect = Pick<CredentialSchema, 'identifier'>;

export type VerificationSchemaSelect = Pick<VerificationSchema, 'verificationCode' | 'updatedAt'>;
