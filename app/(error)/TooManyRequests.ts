import { BaseErrorData, BaseError } from './BaseError';

type TooManyRequestsType = 'TooManyRequests';

type TooManyRequestsCode = 429;

type TooManyRequestDetailWithTime = {
  limit: number;
  retryAfter: number;
};

type TooManyRequestDetailWithCount = {
  count: number;
};

type TooManyRequestDetail = TooManyRequestDetailWithTime | TooManyRequestDetailWithCount;

export class TooManyRequests extends BaseError {
  type!: TooManyRequestsType;
  code!: TooManyRequestsCode;
  detail!: TooManyRequestDetail;

  constructor(
    payload: BaseErrorData<TooManyRequestsType, TooManyRequestsCode, TooManyRequestDetail>
  ) {
    super(payload);
  }
}

export const isTooManyRequests = (error: unknown): error is TooManyRequests => {
  return error instanceof TooManyRequests;
};
