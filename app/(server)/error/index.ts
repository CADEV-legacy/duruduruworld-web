import { NextResponse } from 'next/server';

import { BaseError, DatabaseError } from './BaseError';
import { Conflict } from './Conflict';
import { Forbidden } from './Forbidden';
import { InternalServerError } from './InternalServerError';
import { NotFound } from './NotFound';
import { NotImplemented } from './NotImplemented';
import { Unauthorized } from './Unauthorized';
import { UnsupportedMediaType } from './UnsupportedMediaType';
import { ValidationFailed } from './ValidationFailed';

const BASE_ERROR: Record<string, typeof BaseError> = {
  Conflict,
  Forbidden,
  NotFound,
  NotImplemented,
  Unauthorized,
  UnsupportedMediaType,
  ValidationFailed,
};

const isBaseError = (error: unknown): error is BaseError => {
  return (
    typeof error === 'object' &&
    'type' in (error as object) &&
    'code' in (error as object) &&
    (error as BaseError).type in BASE_ERROR
  );
};

const USER_DEFINED_ERROR_KIND = 'user defined' as const;

const isDatabaseError = (error: unknown): error is DatabaseError => {
  return (
    typeof error === 'object' &&
    'errors' in (error as object) &&
    Object.values((error as DatabaseError).errors).at(0)?.kind === USER_DEFINED_ERROR_KIND
  );
};

export const ErrorResponse = (error: unknown): NextResponse<BaseError> => {
  if (isBaseError(error)) {
    return NextResponse.json(error, { status: error.code, statusText: error.type });
  }

  if (isDatabaseError(error)) {
    const baseErrorInDatabaseErrorArray = Object.values(error.errors).map(error => error.reason);

    const firstBaseErrorType = baseErrorInDatabaseErrorArray[0].type;
    const firstBaseErrorCode = baseErrorInDatabaseErrorArray[0].code;

    const combinedBaseErrorArray = baseErrorInDatabaseErrorArray.filter(
      error => error.type === firstBaseErrorType
    );

    const firstBaseErrorDetail = combinedBaseErrorArray.map(error => error.detail);

    const combinedBaseError = new BaseError({
      type: firstBaseErrorType,
      code: firstBaseErrorCode,
      detail: firstBaseErrorDetail,
    });

    return NextResponse.json(combinedBaseError, {
      status: combinedBaseError.code,
      statusText: combinedBaseError.type,
    });
  }

  const internalServerError = new InternalServerError({
    type: 'InternalServerError',
    code: 500,
    detail: { error: error as Error },
  });

  return NextResponse.json(internalServerError, {
    status: internalServerError.code,
    statusText: internalServerError.type,
  });
};

export * from './BaseError';
export {
  Conflict,
  Forbidden,
  InternalServerError,
  NotFound,
  NotImplemented,
  Unauthorized,
  UnsupportedMediaType,
  ValidationFailed,
};
