import { useMutation } from '@tanstack/react-query';

import { AccountType } from '@/(server)/union';

import {
  authDeleteRequest,
  authDuplicateAccountCheckRequest,
  authDuplicateIdentifierCheckRequest,
  authFindMyIdentifierRequest,
  authPasswordResetRequest,
  authRefreshTokenRequest,
  authSignInRequest,
  authSignOutRequest,
  authSignUpRequest,
  authSignUpInformationRequest,
  authUpdateMeRequest,
  authUpdatePasswordRequest,
  authUpdateStatusRequest,
  authVerificationCodeSendRequest,
  AuthDuplicateAccountCheckRequestProps,
  AuthDuplicateAccountCheckRequestReturn,
  AuthSignInRequestProps,
  AuthSignInResquestReturn,
  AuthSignUpRequestProps,
  AuthSignUpRequestReturn,
  AuthSignUpInformationRequestProps,
  authUpdatePetRequest,
} from '@/(client)/request';

export const useAuthMutation = () => {
  const authDeleteMutation = useMutation({
    mutationFn: authDeleteRequest,
  });

  const authDuplicateAccountCheckMutation = useMutation<
    AuthDuplicateAccountCheckRequestReturn,
    Error,
    AuthDuplicateAccountCheckRequestProps<AccountType>
  >({
    mutationFn: authDuplicateAccountCheckRequest,
  });

  const authDuplicateIdentifierCheckMutation = useMutation({
    mutationFn: authDuplicateIdentifierCheckRequest,
  });

  const authFindMyIdentifierMutation = useMutation({
    mutationFn: authFindMyIdentifierRequest,
  });

  const authPasswordResetMutation = useMutation({
    mutationFn: authPasswordResetRequest,
  });

  const authRefreshTokenMutation = useMutation({
    mutationFn: authRefreshTokenRequest,
  });

  const authSignInMutation = useMutation<
    AuthSignInResquestReturn<AccountType>,
    Error,
    AuthSignInRequestProps<AccountType>
  >({
    mutationFn: authSignInRequest,
  });

  const authSignOutMutation = useMutation({
    mutationFn: authSignOutRequest,
  });

  const authSignUpMutation = useMutation<
    AuthSignUpRequestReturn<AccountType>,
    Error,
    AuthSignUpRequestProps<AccountType>
  >({
    mutationFn: authSignUpRequest,
  });

  const authSignUpInformationMutation = useMutation<
    void,
    Error,
    AuthSignUpInformationRequestProps<AccountType>
  >({
    mutationFn: authSignUpInformationRequest,
  });

  const authUpdateMeMutation = useMutation({
    mutationFn: authUpdateMeRequest,
  });

  const authUpdatePetMutation = useMutation({
    mutationFn: authUpdatePetRequest,
  });

  const authUpdatePasswordMutation = useMutation({
    mutationFn: authUpdatePasswordRequest,
  });

  const authUpdateStatusMutation = useMutation({
    mutationFn: authUpdateStatusRequest,
  });

  const authVerificationCodeSendMutation = useMutation({
    mutationFn: authVerificationCodeSendRequest,
  });

  return {
    authDeleteMutation,
    authDuplicateAccountCheckMutation,
    authDuplicateIdentifierCheckMutation,
    authFindMyIdentifierMutation,
    authPasswordResetMutation,
    authRefreshTokenMutation,
    authSignInMutation,
    authSignOutMutation,
    authSignUpMutation,
    authSignUpInformationMutation,
    authUpdateMeMutation,
    authUpdatePetMutation,
    authUpdatePasswordMutation,
    authUpdateStatusMutation,
    authVerificationCodeSendMutation,
  };
};
