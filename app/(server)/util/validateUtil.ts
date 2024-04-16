import {
  ACCOUNT_STATUS,
  ADMIN_AUTHORITY,
  DELIVERY_COMPANY,
  FAQ_TYPE,
  GENDER,
  INQUIRY_TYPE,
  PACKAGE_STATUS,
  PET_TYPE,
} from '@/(server)/union';

import { ValidationFailed, ValidationFailedDetail } from '@/(error)';

// NOTE: Test Regex
export const IDENTIFIER_REGEX = /^[a-z]{6,12}$/;

export const identifierRegexValidate = (identifier: string) => {
  if (!IDENTIFIER_REGEX.test(identifier)) {
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'identifier', reason: 'REGEX_NOT_MATCHED' }],
    });
  }
};

export const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

export const passwordRegexValidate = (password: string) => {
  if (!PASSWORD_REGEX.test(password)) {
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'password', reason: 'REGEX_NOT_MATCHED' }],
    });
  }
};

export const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const emailRegexValidate = (email: string) => {
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'email', reason: 'REGEX_NOT_MATCHED' }],
    });
  }
};

export const NAME_REGEX = /^[a-zA-Z가-힣]{2,30}$/;

export const nameRegexValidate = (name: string) => {
  if (!NAME_REGEX.test(name)) {
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'name', reason: 'REGEX_NOT_MATCHED' }],
    });
  }
};

export const PHONE_NUMBER_REGEX = /^\d{3}\d{3,4}\d{4}$/;

export const phoneNumberRegexValidate = (phoneNumber: string) => {
  if (!PHONE_NUMBER_REGEX.test(phoneNumber)) {
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'phoneNumber', reason: 'REGEX_NOT_MATCHED' }],
    });
  }
};

export const BIRTH_REGEX = /^\d{8}$/;

export const birthRegexValidate = (value: string) => {
  if (!BIRTH_REGEX.test(value)) {
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'birth', reason: 'REGEX_NOT_MATCHED' }],
    });
  }
};

export const TRACKING_NUMBER_REGEX = /^\d{10,12}$/;

export const trackingNumberRegexValidate = (value: string) => {
  if (!TRACKING_NUMBER_REGEX.test(value)) {
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'trackingNumber', reason: 'REGEX_NOT_MATCHED' }],
    });
  }
};

export const VERIFICATION_CODE_REGEX = /^\d{6}$/;

export const verificationCodeRegexValidate = (value: string) => {
  if (!VERIFICATION_CODE_REGEX.test(value)) {
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'verificationCode', reason: 'REGEX_NOT_MATCHED' }],
    });
  }
};

// NOTE: Test Union
export const adminAuthorityUnionValidate = (authority: string) => {
  if (!(authority in ADMIN_AUTHORITY))
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'authority', reason: 'UNION_NOT_MATCHED' }],
    });
};

export const deliveryCompanyUnionValidate = (company: string) => {
  if (!(company in DELIVERY_COMPANY))
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'company', reason: 'UNION_NOT_MATCHED' }],
    });
};

export const packageStatusUnionValidate = (packageStatus: string) => {
  if (!(packageStatus in PACKAGE_STATUS))
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'packageStatus', reason: 'UNION_NOT_MATCHED' }],
    });
};

export const faqTypeUnionValidate = (type: string) => {
  if (!(type in FAQ_TYPE))
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'type', reason: 'UNION_NOT_MATCHED' }],
    });
};

export const accountStatusUnionValidate = (status: string) => {
  if (!(status in ACCOUNT_STATUS))
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'status', reason: 'UNION_NOT_MATCHED' }],
    });
};

export const genderUnionValidate = (gender: string) => {
  if (!(gender in GENDER))
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'gender', reason: 'UNION_NOT_MATCHED' }],
    });
};

export const petTypeUnionValidate = (type: string) => {
  if (!(type in PET_TYPE))
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'type', reason: 'UNION_NOT_MATCHED' }],
    });
};

export const inquiryTypeUnionValidate = (type: string) => {
  if (!(type in INQUIRY_TYPE))
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: [{ field: 'type', reason: 'UNION_NOT_MATCHED' }],
    });
};

export type ValidateRegexParams = {
  identifier?: string;
  password?: string;
  email?: string;
  name?: string;
  phoneNumber?: string;
  birth?: string;
  trackingNumber?: string;
  verificationCode?: string;
};

type ValidateUnionParams = {
  adminAuthority?: string;
  deliveryCompany?: string;
  packageStatus?: string;
  faqType?: string;
  accountStatus?: string;
  gender?: string;
  petType?: string;
  inquiryType?: string;
};

type ValidateParams = ValidateRegexParams & ValidateUnionParams;

export const validate = ({
  identifier,
  password,
  email,
  name,
  phoneNumber,
  birth,
  trackingNumber,
  verificationCode,
  adminAuthority,
  deliveryCompany,
  packageStatus,
  faqType,
  accountStatus,
  gender,
  petType,
  inquiryType,
}: ValidateParams) => {
  const validateResult: ValidationFailedDetail[] = [];

  if (identifier && !IDENTIFIER_REGEX.test(identifier))
    validateResult.push({ field: 'identifier', reason: 'REGEX_NOT_MATCHED' });
  if (password && !PASSWORD_REGEX.test(password))
    validateResult.push({ field: 'password', reason: 'REGEX_NOT_MATCHED' });
  if (email && !EMAIL_REGEX.test(email))
    validateResult.push({ field: 'email', reason: 'REGEX_NOT_MATCHED' });
  if (name && !NAME_REGEX.test(name))
    validateResult.push({ field: 'name', reason: 'REGEX_NOT_MATCHED' });
  if (phoneNumber && !PHONE_NUMBER_REGEX.test(phoneNumber))
    validateResult.push({ field: 'phoneNumber', reason: 'REGEX_NOT_MATCHED' });
  if (birth && !BIRTH_REGEX.test(birth))
    validateResult.push({ field: 'birth', reason: 'REGEX_NOT_MATCHED' });
  if (trackingNumber && !TRACKING_NUMBER_REGEX.test(trackingNumber))
    validateResult.push({ field: 'trackingNumber', reason: 'REGEX_NOT_MATCHED' });
  if (verificationCode && !VERIFICATION_CODE_REGEX.test(verificationCode))
    validateResult.push({ field: 'verificationCode', reason: 'REGEX_NOT_MATCHED' });

  if (adminAuthority && !(adminAuthority in ADMIN_AUTHORITY))
    validateResult.push({ field: 'adminAuthority', reason: 'UNION_NOT_MATCHED' });
  if (deliveryCompany && !(deliveryCompany in DELIVERY_COMPANY))
    validateResult.push({ field: 'deliveryCompany', reason: 'UNION_NOT_MATCHED' });
  if (packageStatus && !(packageStatus in PACKAGE_STATUS))
    validateResult.push({ field: 'packageStatus', reason: 'UNION_NOT_MATCHED' });
  if (faqType && !(faqType in FAQ_TYPE))
    validateResult.push({ field: 'faqType', reason: 'UNION_NOT_MATCHED' });
  if (accountStatus && !(accountStatus in ACCOUNT_STATUS))
    validateResult.push({ field: 'accountStatus', reason: 'UNION_NOT_MATCHED' });
  if (gender && !(gender in GENDER))
    validateResult.push({ field: 'gender', reason: 'UNION_NOT_MATCHED' });
  if (petType && !(petType in PET_TYPE))
    validateResult.push({ field: 'petType', reason: 'UNION_NOT_MATCHED' });
  if (inquiryType && !(inquiryType in INQUIRY_TYPE))
    validateResult.push({ field: 'inquiryType', reason: 'UNION_NOT_MATCHED' });

  if (validateResult.length) {
    throw new ValidationFailed({
      type: 'ValidationFailed',
      code: 422,
      detail: validateResult,
    });
  }
};
