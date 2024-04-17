import { AccountSchema, KakaoSchema } from '@/(server)/model';

export type AuthDuplicateAccountCheckRequestSearchParams = Pick<AccountSchema, 'type'>;

export type AuthDuplicateKakaoAccountCheckRequestSearchParams = Pick<
  KakaoSchema,
  'productAccountId'
>;

export type AuthDuplicateAccountCheckResponse = {
  isDuplicate: boolean;
};
