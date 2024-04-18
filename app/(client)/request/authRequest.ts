import { baseRequest } from '.';

import { AccountType } from '@/(server)/union';

import {
  AuthDeleteCredentialRequestSearchParams,
  AuthDeleteSSORequestSearchParams,
} from '@/(server)/api/auth/delete/type';
import {
  AuthDuplicateAccountCheckResponse,
  AuthDuplicateKakaoAccountCheckRequestSearchParams,
} from '@/(server)/api/auth/duplicate-account-check/type';
import {
  AuthDuplicateIdentifierCheckRequestSearchParams,
  AuthDuplicateIdentifierCheckResponse,
} from '@/(server)/api/auth/duplicate-identifier-check/type';
import {
  AuthFindMyIdentifierRequestSearchParams,
  AuthFindMyIdentifierResponse,
} from '@/(server)/api/auth/find-my-identifier/type';
import { AuthPasswordResetRequestBody } from '@/(server)/api/auth/password-reset/type';
import { AuthRefreshTokenResponse } from '@/(server)/api/auth/refresh-token/type';
import {
  AuthSignInCredentialRequestBody,
  AuthSignInCredentialResponse,
  AuthSignInKakaoRequestBody,
  AuthSignInKakaoResponse,
} from '@/(server)/api/auth/sign-in/type';
import { AuthSignUpInformationRequestBody } from '@/(server)/api/auth/sign-up/information/type';
import {
  AuthSignUpCredentialRequestBody,
  AuthSignUpKakaoRequestBody,
  AuthSignUpSSOResponse,
} from '@/(server)/api/auth/sign-up/type';
import { AuthUpdateMeRequestBody } from '@/(server)/api/auth/update/me/type';
import { AuthUpdatePasswordRequestBody } from '@/(server)/api/auth/update/password/type';
import { AuthUpdateStatusRequestBody } from '@/(server)/api/auth/update/status/type';
import { AuthVerificationCodeSendRequestBody } from '@/(server)/api/auth/verification-code/send/type';

import { API_URL } from '@/constant';

export type AuthDeleteCredentialRequestProps = AuthDeleteCredentialRequestSearchParams;

export const authDeleteCredentialRequest = async (params: AuthDeleteCredentialRequestProps) => {
  const response = await baseRequest<void>({
    method: 'delete',
    url: API_URL.auth.delete,
    params,
    hasAuth: true,
  });

  return response.data;
};

// TODO: Implement this after ready for kakao login.
export type AuthDeleteSSORequestProps = AuthDeleteSSORequestSearchParams;

export const authDeleteSSORequest = async (params: AuthDeleteSSORequestProps) => {
  const response = await baseRequest<void>({
    method: 'delete',
    url: API_URL.auth.delete,
    hasAuth: true,
    params,
  });

  return response.data;
};

export type AuthDuplicateAccountCheckRequestProps<TAccountType extends AccountType> =
  TAccountType extends 'credential'
    ? { type: 'credential' }
    : TAccountType extends 'kakao'
      ? { type: 'kakao' } & AuthDuplicateKakaoAccountCheckRequestSearchParams
      : { type: 'credential' };

export type AuthDuplicateAccountCheckRequestReturn = AuthDuplicateAccountCheckResponse;

export const authDuplicateAccountCheckRequest = async <T extends AccountType>(
  params: AuthDuplicateAccountCheckRequestProps<T>
) => {
  const response = await baseRequest<AuthDuplicateAccountCheckRequestReturn>({
    method: 'get',
    url: API_URL.auth.duplicateAccountCheck,
    params,
  });

  return response.data;
};

export type AuthDuplicateIdentifierCheckRequestProps =
  AuthDuplicateIdentifierCheckRequestSearchParams;

export type AuthDuplicateIdentifierCheckRequestReturn = AuthDuplicateIdentifierCheckResponse;

export const authDuplicateIdentifierCheckRequest = async (
  params: AuthDuplicateIdentifierCheckRequestProps
) => {
  const response = await baseRequest<AuthDuplicateIdentifierCheckRequestReturn>({
    method: 'get',
    url: API_URL.auth.duplicateIdentifierCheck,
    params,
  });

  return response.data;
};

export type AuthFindMyIdentifierRequestProps = AuthFindMyIdentifierRequestSearchParams;

export type AuthFindMyIdentifierRequestReturn = AuthFindMyIdentifierResponse;

export const authFindMyIdentifierRequest = async (params: AuthFindMyIdentifierRequestProps) => {
  const response = await baseRequest<AuthFindMyIdentifierRequestReturn>({
    method: 'get',
    url: API_URL.auth.findMyIdentifier,
    params,
  });

  return response.data;
};

export type AuthPasswordResetRequestProps = AuthPasswordResetRequestBody;

export const authPasswordResetRequest = async (data: AuthPasswordResetRequestProps) => {
  const response = await baseRequest<void>({
    method: 'patch',
    url: API_URL.auth.passwordReset,
    data,
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

export type AuthSignInRequestProps<TAccountType extends AccountType> =
  TAccountType extends 'credential'
    ? { type: 'credential' } & AuthSignInCredentialRequestBody
    : TAccountType extends 'kakao'
      ? { type: 'kakao' } & AuthSignInKakaoRequestBody
      : never;

export type AuthSignInResquestReturn<TAccountType extends AccountType> =
  TAccountType extends 'credential'
    ? AuthSignInCredentialResponse
    : TAccountType extends 'kakao'
      ? AuthSignInKakaoResponse
      : void;

export const authSignInRequest = async <T extends AccountType>(data: AuthSignInRequestProps<T>) => {
  const response = await baseRequest<AuthSignInResquestReturn<T>>({
    method: 'post',
    url: API_URL.auth.signIn,
    data,
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

export type AuthSignUpRequestProps<TAccountType extends AccountType> =
  TAccountType extends 'credential'
    ? { type: 'credential' } & AuthSignUpCredentialRequestBody
    : TAccountType extends 'kakao'
      ? { type: 'kakao' } & AuthSignUpKakaoRequestBody
      : never;

export type AuthSignUpRequestReturn<TAccountType extends AccountType> =
  TAccountType extends 'credential' ? void : AuthSignUpSSOResponse;

export const authSignUpRequest = async <T extends AccountType>(data: AuthSignUpRequestProps<T>) => {
  const response = await baseRequest<AuthSignUpRequestReturn<T>>({
    method: 'post',
    url: API_URL.auth.signUp.prefix,
    contentType: 'multipart',
    data,
  });

  return response.data;
};

export type AuthSignUpInformationRequestProps<TAccountType extends AccountType> =
  TAccountType extends 'credential'
    ? never
    : TAccountType extends 'kakao'
      ? { type: 'kakao' } & AuthSignUpInformationRequestBody
      : never;

export const authSignUpInformationRequest = async <T extends AccountType>(
  data: AuthSignUpInformationRequestProps<T>
) => {
  const response = await baseRequest<void>({
    method: 'post',
    url: API_URL.auth.signUp.information,
    data,
  });

  return response.data;
};

export type AuthUpdateMeRequestProps = AuthUpdateMeRequestBody;

export const authUpdateMeRequest = async (data: AuthUpdateMeRequestProps) => {
  const response = await baseRequest<void>({
    method: 'patch',
    url: API_URL.auth.update.me,
    data,
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
