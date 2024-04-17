import { BaseErrorData, BaseError } from './BaseError';

type BadRequestType = 'BadRequest';

type BadRequestCode = 400;

type BadRequestDetailReason = 'REQUIRED' | 'NOT_SUPPORTED';

type BadRequestDetail = {
  field: string;
  reason: BadRequestDetailReason;
};

export class BadRequest extends BaseError {
  type!: BadRequestType;
  code!: BadRequestCode;
  detail!: BadRequestDetail[];

  constructor(payload: BaseErrorData<BadRequestType, BadRequestCode, BadRequestDetail[]>) {
    super(payload);
  }
}

export const isBadRequest = (error: unknown): error is BadRequest => {
  return error instanceof BadRequest;
};
