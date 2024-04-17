import { CredentialSchema, VerificationSchema } from '@/(server)/model';

export type AuthPasswordResetRequestBody = Pick<CredentialSchema, 'identifier' | 'phoneNumber'> &
  Pick<VerificationSchema, 'verificationCode'> & { newPassword: string };
