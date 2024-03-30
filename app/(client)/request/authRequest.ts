import { baseRequest } from '.';

import { AuthDeleteRequestSearchParams } from '@/(server)/api/auth/delete/type';
import {
  AuthDuplicateAccountCheckRequestSearchParams,
  AuthDuplicateAccountCheckResponse,
} from '@/(server)/api/auth/duplicate-account-check/type';
import {
  AuthDuplicateEmailCheckRequestSearchParams,
  AuthDuplicateEmailCheckResponse,
} from '@/(server)/api/auth/duplicate-email-check/type';
import {
  AuthFindMyEmailRequestSearchParams,
  AuthFindMyEmailResponse,
} from '@/(server)/api/auth/find-my-email/type';
import { AuthPasswordResetRequestBody } from '@/(server)/api/auth/password-reset/type';
import { AuthRefreshTokenResponse } from '@/(server)/api/auth/refresh-token/type';
import { AuthSignInRequestBody } from '@/(server)/api/auth/sign-in/type';
import { AuthSignUpRequestBody } from '@/(server)/api/auth/sign-up/type';
import { AuthSSORegisterRequestBody } from '@/(server)/api/auth/sso/register/type';
import { AuthSSOSignUpRequestBody } from '@/(server)/api/auth/sso/sign-up/type';
import { AuthUpdateEmailRequestBody } from '@/(server)/api/auth/update/email/type';
import { AuthUpdateMeRequestBody } from '@/(server)/api/auth/update/me/type';
import { AuthUpdatePasswordRequestBody } from '@/(server)/api/auth/update/password/type';
import { AuthUpdateStatusRequestBody } from '@/(server)/api/auth/update/status/type';
import { API_URL } from '@/constant';

export type AuthDeleteRequestProps = AuthDeleteRequestSearchParams;

export const authDeleteRequest = async ({ password }: AuthDeleteRequestProps) => {
  const response = await baseRequest<void>({
    method: 'delete',
    url: API_URL.auth.delete,
    params: {
      password,
    },
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

export type AuthDuplicateEmailCheckRequestProps = AuthDuplicateEmailCheckRequestSearchParams;

export type AuthDuplicateEmailCheckRequestReturn = AuthDuplicateEmailCheckResponse;

export const authDulicateEmailCheckRequest = async ({
  email,
}: AuthDuplicateEmailCheckRequestProps) => {
  const response = await baseRequest<AuthDuplicateEmailCheckRequestReturn>({
    method: 'get',
    url: API_URL.auth.duplicateEmailCheck,
    params: { email },
  });

  return response.data;
};

export type AuthFindMyEmailRequestProps = AuthFindMyEmailRequestSearchParams;

export type AuthFindMyEmailRequestReturn = AuthFindMyEmailResponse;

export const authFindMyEmailRequest = async ({
  phoneNumber,
  isVerified,
}: AuthFindMyEmailRequestProps) => {
  const response = await baseRequest<AuthFindMyEmailRequestReturn>({
    method: 'get',
    url: API_URL.auth.findMyEmail,
    params: {
      isVerified,
      phoneNumber,
    },
  });

  return response.data;
};

export type AuthPasswordResetRequestProps = AuthPasswordResetRequestBody;

export const authPasswordResetRequest = async ({
  email,
  newPassword,
  isVerified,
}: AuthPasswordResetRequestProps) => {
  const response = await baseRequest<void>({
    method: 'patch',
    url: API_URL.auth.passwordReset,
    data: {
      email,
      newPassword,
      isVerified,
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

export const authSignInRequest = async ({
  email,
  password,
  autoSignIn,
}: AuthSignInRequestProps) => {
  const response = await baseRequest<void>({
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
  });

  return response.data;
};

export type AuthSignUpRequestProps = AuthSignUpRequestBody;

export const authSignUpRequest = async ({
  email,
  password,
  name,
  image,
  phoneNumber,
  age,
  gender,
  address,
}: AuthSignUpRequestProps) => {
  const response = await baseRequest<void>({
    method: 'post',
    url: API_URL.auth.signUp,
    data: {
      email,
      password,
      name,
      image,
      phoneNumber,
      age,
      gender,
      address,
    },
  });

  return response.data;
};

export type AuthSSORegisterRequestProps = AuthSSORegisterRequestBody;

export const authSSORegisterRequest = async ({
  email,
  name,
  image,
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
      image,
      phoneNumber,
      age,
      gender,
      address,
    },
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
  });

  return response.data;
};

export type AuthUpdateEmailRequestProps = AuthUpdateEmailRequestBody;

export const authUpdateEmailRequest = async ({ newEmail }: AuthUpdateEmailRequestProps) => {
  const response = await baseRequest<void>({
    method: 'patch',
    url: API_URL.auth.update.email,
    data: {
      newEmail,
    },
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
  });

  return response.data;
};
