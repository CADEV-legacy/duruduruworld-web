import { useMutation } from '@tanstack/react-query';

import {
  authDuplicateIDCheckRequest,
  authFindMyIDRequest,
  authPasswordResetRequest,
  authSignInRequest,
  authSignUpRequest,
  authVerificationCodeSendRequest,
} from '@/(client)/request';

export const useAuthMutation = () => {
  const { mutateAsync: authSignUpMutation } = useMutation({ mutationFn: authSignUpRequest });

  const { mutateAsync: authSignInMutation } = useMutation({ mutationFn: authSignInRequest });

  const { mutateAsync: authDuplicateIDCheckMutation } = useMutation({
    mutationFn: authDuplicateIDCheckRequest,
  });

  const { mutateAsync: authVerificationCodeSendMutation } = useMutation({
    mutationFn: authVerificationCodeSendRequest,
  });

  const { mutateAsync: authFindMyIDMutation } = useMutation({
    mutationFn: authFindMyIDRequest,
  });

  const { mutateAsync: authPasswordResetMutation } = useMutation({
    mutationFn: authPasswordResetRequest,
  });

  return {
    authSignUpMutation,
    authSignInMutation,
    authDuplicateIDCheckMutation,
    authVerificationCodeSendMutation,
    authFindMyIDMutation,
    authPasswordResetMutation,
  };
};
