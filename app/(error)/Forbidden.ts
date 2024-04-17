import { BaseErrorData, BaseError } from './BaseError';

type ForbiddenType = 'Forbidden';

type ForbiddenCode = 403;

type ForbiddenDetailReason = 'TIMEOUT' | 'INVALID' | 'UNAUTHORIZED' | 'RESTRICTED';

type ForbiddenDetail = {
  field: string;
  reason: ForbiddenDetailReason;
};

export class Forbidden extends BaseError {
  type!: ForbiddenType;
  code!: ForbiddenCode;
  detail!: ForbiddenDetail;

  constructor(payload: BaseErrorData<ForbiddenType, ForbiddenCode, ForbiddenDetail>) {
    super(payload);
  }
}

export const isForbidden = (error: unknown): error is Forbidden => {
  return error instanceof Forbidden;
};
