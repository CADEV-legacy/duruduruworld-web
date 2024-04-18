import { AccountSchema, CredentialSchema } from '@/(server)/model';

export type AuthDeleteCredentialRequestSearchParams = {
  password: string;
};

export type AccountSchemaSelect = Pick<AccountSchema, 'type' | 'status' | 'refreshToken'>;

export type CredentialSchemaSelect = Pick<CredentialSchema, 'password'>;
