import { AccountSchema, KakaoSchema } from '@/(server)/model';

export type AccountSchemaSelect = Pick<AccountSchema, '_id' | 'refreshToken'>;

export type KakaoSchemaSelect = Pick<KakaoSchema, 'kakaoRefreshToken'>;
