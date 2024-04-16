'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
  FieldErrors,
  FormContainer,
  PasswordElement,
  TextFieldElement,
  useForm,
} from 'react-hook-form-mui';

import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import * as S from './PasswordResetForm.styles';

import { FormItem } from '@/(client)/component';
import { useTimerHook } from '@/(client)/hook';
import { AuthPasswordResetRequestProps } from '@/(client)/request';
import { useAuthMutation } from '@/(client)/service';

import { isTooManyRequests } from '@/(error)';

import { ROUTE_URL } from '@/constant';

type PasswordResetFormProps = AuthPasswordResetRequestProps & {
  phoneNumber: string;
  newPasswordAccept: string;
};

const PASSWORD_RESET_FORM_DEFAULT_VALUES: PasswordResetFormProps = {
  phoneNumber: '',
  email: '',
  verificationCode: '',
  newPassword: '',
  newPasswordAccept: '',
};

export const PasswordResetForm: React.FC = () => {
  const router = useRouter();
  const passwordResetForm = useForm<PasswordResetFormProps>({
    defaultValues: PASSWORD_RESET_FORM_DEFAULT_VALUES,
  });
  const { authVerificationCodeSendMutation, authPasswordResetMutation } = useAuthMutation();
  const { run, reset, timerStatus, leftTime } = useTimerHook({ time: { minutes: 5 } });
  const { enqueueSnackbar } = useSnackbar();

  const leftTimeString = useMemo(() => {
    if (!timerStatus || timerStatus === 'initialized') return;

    const minutes = leftTime.minutes;
    const seconds = leftTime.seconds;

    return `0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }, [timerStatus, leftTime]);

  const onPasswordResetFormSuccess = async (data: PasswordResetFormProps) => {
    try {
      await authPasswordResetMutation(data);

      router.push(`${ROUTE_URL.auth.passwordReset.result}`);
    } catch (error) {
      console.info(error);
    }
  };

  const onPasswordResetFormError = (field: FieldErrors<PasswordResetFormProps>) => {
    console.error('Find My ID Form Error', field);
  };

  const onVerificationRequestButtonClick = async () => {
    const phoneNumber = passwordResetForm.getValues('phoneNumber');

    if (!phoneNumber) {
      passwordResetForm.setError('phoneNumber', {
        message: '인증 요청 전에 핸드폰 번호는 필수입니다.',
      });

      return;
    }

    passwordResetForm.clearErrors('phoneNumber');

    try {
      await authVerificationCodeSendMutation({
        phoneNumber: passwordResetForm.getValues('phoneNumber'),
      });

      reset();
      run();

      enqueueSnackbar('인증번호가 발송되었습니다.');
    } catch (error) {
      if (isTooManyRequests(error)) {
        const retryAfterDate = new Date(error.detail.retryAfter);
        const retryAfterMinutes = retryAfterDate.getMinutes();
        const retryAfterSeconds = retryAfterDate.getSeconds();

        enqueueSnackbar(
          `인증번호 요청은 5분에 한 번만 가능합니다. 요청 가능 시간은 ${retryAfterMinutes}분 ${retryAfterSeconds}초 후 입니다.`,
          { variant: 'error' }
        );
      }
    }
  };

  return (
    <FormContainer
      formContext={passwordResetForm}
      onSuccess={onPasswordResetFormSuccess}
      onError={onPasswordResetFormError}>
      <FormItem
        label='가입한 휴대폰 번호를 입력해주세요.'
        formHandleButtonProps={{
          text: '인증 요청',
          onClick: onVerificationRequestButtonClick,
        }}>
        <TextFieldElement
          name='phoneNumber'
          placeholder='하이폰(-)을 제외한 문자열입니다. 예) 01012345678'
          required
        />
      </FormItem>
      <S.VerificationCodeInputContainer>
        <TextFieldElement
          name='verificationCode'
          placeholder='전송된 인증번호를 입력해주세요.'
          required
        />
        <S.VerificationTimerContainer>
          <Typography variant='h5'>{leftTimeString}</Typography>
        </S.VerificationTimerContainer>
      </S.VerificationCodeInputContainer>
      <FormItem label='새로운 비밀번호'>
        <PasswordElement
          name='password'
          placeholder='공백 제외, 8~30자 영문, 숫자 필수 입력(특수 문자 선택 입력)'
          required
        />
      </FormItem>
      <FormItem label='비밀번호를 다시 입력해주세요'>
        <PasswordElement
          name='passwordAccept'
          placeholder='비밀번호와 동일하게 입력해주세요.'
          required
        />
      </FormItem>
      <S.PasswordResetButton type='submit'>비밀번호 재설정</S.PasswordResetButton>
    </FormContainer>
  );
};
