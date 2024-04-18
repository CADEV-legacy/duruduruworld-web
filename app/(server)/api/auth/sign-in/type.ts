import { AccountSchema, CredentialSchema, KakaoSchema } from '@/(server)/model';

export type AuthSignInRequestBody = Pick<AccountSchema, 'type'>;

export type AuthSignInCredentialRequestBody = Pick<CredentialSchema, 'identifier' | 'password'> & {
  autoSignIn: boolean;
};

export type AuthSignInKakaoRequestBody = Pick<KakaoSchema, 'productAccountId'> & {
  autoSignIn: boolean;
};

export type AuthSignInCredentialResponse = {
  accessToken: string;
};

export type AuthSignInKakaoResponse = {
  accessToken: string;
  isNeedMoreInformation: boolean;
};

export type CredentialSchemaSelect = Pick<CredentialSchema, 'password' | 'account'>;

export type AccountSchemaSelect = Pick<AccountSchema, 'type' | 'status' | 'refreshToken'>;

export type KakaoSchemaSelect = Pick<KakaoSchema, 'account'>;
