import { baseRequest } from '.';

import { AuthDeleteRequestSearchParams } from '@/(server)/api/auth/delete/type';
import {
  AuthDuplicateAccountCheckRequestSearchParams,
  AuthDuplicateAccountCheckResponse,
} from '@/(server)/api/auth/duplicate-account-check/type';
import {
  AuthDuplicateIDCheckRequestSearchParams,
  AuthDuplicateIDCheckResponse,
} from '@/(server)/api/auth/duplicate-id-check/type';
import {
  AuthFindMyIDRequestSearchParams,
  AuthFindMyIDResponse,
} from '@/(server)/api/auth/find-my-id/type';
import { AuthPasswordResetRequestBody } from '@/(server)/api/auth/password-reset/type';
import { AuthRefreshTokenResponse } from '@/(server)/api/auth/refresh-token/type';
import { AuthSignInRequestBody, AuthSignInResponse } from '@/(server)/api/auth/sign-in/type';
import { AuthSignUpRequestBody } from '@/(server)/api/auth/sign-up/type';
import { AuthSSORegisterRequestBody } from '@/(server)/api/auth/sso/register/type';
import { AuthSSOSignUpRequestBody } from '@/(server)/api/auth/sso/sign-up/type';
import { AuthUpdateIDRequestBody } from '@/(server)/api/auth/update/id/type';
import { AuthUpdateMeRequestBody } from '@/(server)/api/auth/update/me/type';
import { AuthUpdatePasswordRequestBody } from '@/(server)/api/auth/update/password/type';
import { AuthUpdateStatusRequestBody } from '@/(server)/api/auth/update/status/type';
import { AuthVerificationCodeSendRequestBody } from '@/(server)/api/auth/verification-code/send/type';

import { API_URL } from '@/constant';

export type AuthDeleteRequestProps = AuthDeleteRequestSearchParams;

export const authDeleteRequest = async ({ password }: AuthDeleteRequestProps) => {
  const response = await baseRequest<void>({
    method: 'delete',
    url: API_URL.auth.delete,
    params: {
      password,
    },
    hasAuth: true,
  });

  return response.data;
};

export type AuthDuplicateAccountCheckRequestProps = AuthDuplicateAccountCheckRequestSearchParams;

export type AuthDuplicateAccountCheckRequestReturn = AuthDuplicateAccountCheckResponse;

export const authDuplicateAccountCheckRequest = async ({
  type,
  productAccountId,
}: AuthDuplicateAccountCheckRequestProps) => {
  const response = await baseRequest<AuthDuplicateAccountCheckRequestReturn>({
    method: 'get',
    url: API_URL.auth.duplicateAccountCheck,
    params: { type, productAccountId },
  });

  return response.data;
};

export type AuthDuplicateIDCheckRequestProps = AuthDuplicateIDCheckRequestSearchParams;

export type AuthDuplicateIDCheckRequestReturn = AuthDuplicateIDCheckResponse;

export const authDuplicateIDCheckRequest = async ({ email }: AuthDuplicateIDCheckRequestProps) => {
  const response = await baseRequest<AuthDuplicateIDCheckRequestReturn>({
    method: 'get',
    url: API_URL.auth.duplicateIDCheck,
    params: { email },
  });

  return response.data;
};

export type AuthFindMyIDRequestProps = AuthFindMyIDRequestSearchParams;

export type AuthFindMyIDRequestReturn = AuthFindMyIDResponse;

export const authFindMyIDRequest = async ({
  phoneNumber,
  verificationCode,
}: AuthFindMyIDRequestProps) => {
  const response = await baseRequest<AuthFindMyIDRequestReturn>({
    method: 'get',
    url: API_URL.auth.findMyID,
    params: {
      verificationCode,
      phoneNumber,
    },
  });

  return response.data;
};

export type AuthPasswordResetRequestProps = AuthPasswordResetRequestBody;

export const authPasswordResetRequest = async ({
  email,
  newPassword,
  verificationCode,
}: AuthPasswordResetRequestProps) => {
  const response = await baseRequest<void>({
    method: 'patch',
    url: API_URL.auth.passwordReset,
    data: {
      email,
      newPassword,
      verificationCode,
    },
  });

  return response.data;
};

export type AuthRefreshTokenRequestReturn = AuthRefreshTokenResponse;

export const authRefreshTokenRequest = async () => {
  const response = await baseRequest<AuthRefreshTokenRequestReturn>({
    method: 'post',
    url: API_URL.auth.refreshToken,
  });

  return response.data;
};

export type AuthSignInRequestProps = AuthSignInRequestBody;

export type AuthSignInResponseReturn = AuthSignInResponse;

export const authSignInRequest = async ({
  email,
  password,
  autoSignIn,
}: AuthSignInRequestProps) => {
  const response = await baseRequest<AuthSignInResponseReturn>({
    method: 'post',
    url: API_URL.auth.signIn,
    data: {
      email,
      password,
      autoSignIn,
    },
  });

  return response.data;
};

export const authSignOutRequest = async () => {
  const response = await baseRequest<void>({
    method: 'post',
    url: API_URL.auth.signOut,
    hasAuth: true,
  });

  return response.data;
};

export type AuthSignUpRequestProps = {
  data: FormData;
};

export type { AuthSignUpRequestBody };

export const authSignUpRequest = async ({ data }: AuthSignUpRequestProps) => {
  const response = await baseRequest<void>({
    method: 'post',
    url: API_URL.auth.signUp,
    contentType: 'multipart',
    data,
  });

  return response.data;
};

export type AuthSSORegisterRequestProps = AuthSSORegisterRequestBody;

export const authSSORegisterRequest = async ({
  email,
  name,
  phoneNumber,
  age,
  gender,
  address,
}: AuthSSORegisterRequestProps) => {
  const response = await baseRequest<void>({
    method: 'post',
    url: API_URL.auth.sso.register,
    data: {
      email,
      name,
      phoneNumber,
      age,
      gender,
      address,
    },
    hasAuth: true,
  });

  return response.data;
};

export type AuthSSOSignUpRequestProps = AuthSSOSignUpRequestBody;

export const authSSOSignUp = async ({ type, productAccountId }: AuthSSOSignUpRequestProps) => {
  const response = await baseRequest<void>({
    method: 'post',
    url: API_URL.auth.sso.signUp,
    data: {
      type,
      productAccountId,
    },
    hasAuth: true,
  });

  return response.data;
};

export type AuthUpdateIDRequestProps = AuthUpdateIDRequestBody;

export const authUpdateIDRequest = async ({ newEmail }: AuthUpdateIDRequestProps) => {
  const response = await baseRequest<void>({
    method: 'patch',
    url: API_URL.auth.update.id,
    data: {
      newEmail,
    },
    hasAuth: true,
  });

  return response.data;
};

export type AuthUpdateMeRequestProps = AuthUpdateMeRequestBody;

export const authUpdateMeRequest = async ({
  name,
  phoneNumber,
  age,
  gender,
  address,
}: AuthUpdateMeRequestProps) => {
  const response = await baseRequest<void>({
    method: 'patch',
    url: API_URL.auth.update.me,
    data: {
      name,
      phoneNumber,
      age,
      gender,
      address,
    },
    hasAuth: true,
  });

  return response.data;
};

export type AuthUpdatePasswordRequestProps = AuthUpdatePasswordRequestBody;

export const authUpdatePasswordRequest = async ({
  currentPassword,
  newPassword,
}: AuthUpdatePasswordRequestProps) => {
  const response = await baseRequest<void>({
    method: 'patch',
    url: API_URL.auth.update.password,
    data: {
      currentPassword,
      newPassword,
    },
    hasAuth: true,
  });

  return response.data;
};

export type AuthUpdateStatusRequestProps = AuthUpdateStatusRequestBody;

export const authUpdateStatusRequest = async ({ status }: AuthUpdateStatusRequestProps) => {
  const response = await baseRequest<void>({
    method: 'patch',
    url: API_URL.auth.update.status,
    data: {
      status,
    },
    hasAuth: true,
  });

  return response.data;
};

export type AuthVerificationCodeSendRequestProps = AuthVerificationCodeSendRequestBody;

export const authVerificationCodeSendRequest = async ({
  phoneNumber,
}: AuthVerificationCodeSendRequestBody) => {
  const response = await baseRequest<void>({
    method: 'post',
    url: API_URL.auth.verificationCode.send,
    data: { phoneNumber },
  });

  return response.data;
};
