import { BaseErrorData, BaseError } from './BaseError';

type ValidationFailedType = 'ValidationFailed';

type ValidationFailedCode = 422;

type ValidationFailedReason = 'REGEX_NOT_MATCHED' | 'UNION_NOT_MATCHED' | 'NOT_MATCHED';

export type ValidationFailedDetail = {
  field: string;
  reason: ValidationFailedReason;
};

export class ValidationFailed extends BaseError {
  type!: ValidationFailedType;
  code!: ValidationFailedCode;
  detail!: ValidationFailedDetail[];

  constructor(
    payload: BaseErrorData<ValidationFailedType, ValidationFailedCode, ValidationFailedDetail[]>
  ) {
    super(payload);
  }
}

export const isValidationFailed = (error: unknown): error is ValidationFailed => {
  return error instanceof ValidationFailed;
};
