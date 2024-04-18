import { AccountSchema } from '@/(server)/model';

export type AuthRefreshTokenResponse = {
  accessToken: string;
};

export type AccountSchemaSelect = Pick<AccountSchema, 'refreshToken'>;
