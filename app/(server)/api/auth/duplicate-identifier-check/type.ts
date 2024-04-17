import { CredentialSchema } from '@/(server)/model';

export type AuthDuplicateIdentifierCheckRequestSearchParams = Pick<CredentialSchema, 'identifier'>;

export type AuthDuplicateIdentifierCheckResponse = {
  isDuplicate: boolean;
};
