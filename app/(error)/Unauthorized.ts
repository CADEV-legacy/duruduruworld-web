import { BaseErrorData, BaseError } from './BaseError';

type UnauthorizedType = 'Unauthorized';

type UnauthorizedCode = 401;

type TokenDestroyed = {
  name: 'TokenDestroyed';
  message: 'refresh token destroyed';
};

type TokenNotExist = {
  name: 'TokenNotExist';
  message: 'access token not exist' | 'refresh token not exist';
};

type TokenExpiredError = {
  name: 'TokenExpiredError';
  messsage: 'jwt expired';
  expiredAt: number;
};

type TokenTypeError = {
  name: 'TokenTypeError';
  message: 'bearer token required';
};

type JsonWebTokenError = {
  name: 'JsonWebTokenError';
  message:
    | 'invalid token'
    | 'jwt malformed'
    | 'jwt signature is required'
    | 'invalid signature'
    | 'jwt audience invalid'
    | 'jwt issuer invalid'
    | 'jwt id invalid'
    | 'jwt subject invalid';
};

type NotBeforeError = {
  name: 'NotBeforeError';
  message: 'jwt not active';
  date: Date;
};

type UnauthorizedDetail =
  | TokenDestroyed
  | TokenNotExist
  | TokenExpiredError
  | JsonWebTokenError
  | NotBeforeError
  | TokenTypeError;

export class Unauthorized extends BaseError {
  type!: UnauthorizedType;
  code!: UnauthorizedCode;
  detail!: UnauthorizedDetail;

  constructor(payload: BaseErrorData<UnauthorizedType, UnauthorizedCode, UnauthorizedDetail>) {
    super(payload);
  }
}

export const isUnauthorized = (error: unknown): error is Unauthorized => {
  return error instanceof Unauthorized;
};
