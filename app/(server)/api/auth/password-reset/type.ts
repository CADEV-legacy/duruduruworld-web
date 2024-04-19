import { CredentialSchema, VerificationSchema } from '@/(server)/model';

export type AuthPasswordResetRequestBody = Pick<CredentialSchema, 'identifier' | 'phoneNumber'> &
  Pick<VerificationSchema, 'verificationCode'> & { newPassword: string; newPasswordAccept: string };

export type CredentialSchemaSelect = Pick<CredentialSchema, 'identifier' | 'password'>;

export type VerificationSchemaSelect = Pick<VerificationSchema, 'verificationCode' | 'updatedAt'>;
