import { CredentialSchema } from '@/(server)/model';

export type AuthUpdatePasswordRequestBody = {
  currentPassword: string;
  newPassword: string;
};

export type CredentialSchemaSelect = Pick<CredentialSchema, 'password'>;
