'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FormContainer, PasswordElement, TextFieldElement, useForm } from 'react-hook-form-mui';

import { Typography } from '@mui/material';

import * as S from './PasswordResetForm.styles';

import {
  IDENTIFIER_REGEX,
  PASSWORD_REGEX,
  PHONE_NUMBER_REGEX,
  VERIFICATION_CODE_REGEX,
} from '@/(server)/util';

import { FormItem } from '@/(client)/component';
import { useTimerHook } from '@/(client)/hook';
import { AuthPasswordResetRequestProps } from '@/(client)/request';
import { useAuthMutation } from '@/(client)/service';

import {
  isBadRequest,
  isForbidden,
  isNotFound,
  isTooManyRequestWithCount,
  isTooManyRequestWithTime,
  isTooManyRequests,
  isValidationFailed,
} from '@/(error)';

import { ROUTE_URL } from '@/constant';

const EXCEPT_NUMBER_REGEX = /[^0-9]/g;
const SPACE_REGEX = /\s/g;

type PasswordResetFormProps = AuthPasswordResetRequestProps;

const PASSWORD_RESET_FORM_DEFAULT_VALUES: PasswordResetFormProps = {
  identifier: '',
  phoneNumber: '',
  verificationCode: '',
  newPassword: '',
  newPasswordAccept: '',
};

const VALIDATION: {
  [key in keyof PasswordResetFormProps]?: {
    required?: string;
    pattern?: { value: RegExp; message: string };
  };
} = {
  identifier: {
    required: '아이디를 입력해주세요.',
    pattern: {
      value: IDENTIFIER_REGEX,
      message: '6-20자의 영문 소문자, 숫자, 언더바(_)만 사용 가능합니다.',
    },
  },
  newPassword: {
    required: '새로운 비밀번호를 입력해주세요.',
    pattern: {
      value: PASSWORD_REGEX,
      message: '8-30자의 영문 대/소문자, 숫자, 특수문자 각 1가지 이상을 조합해주세요.',
    },
  },
  newPasswordAccept: {
    required: '비밀번호를 다시 입력해주세요.',
  },
  phoneNumber: {
    required: '휴대전화번호를 입력해주세요.',
    pattern: {
      value: PHONE_NUMBER_REGEX,
      message: '휴대전화번호가 정확한지 확인해 주세요.',
    },
  },
  verificationCode: {
    required: '인증번호를 입력해주세요.',
    pattern: {
      value: VERIFICATION_CODE_REGEX,
      message: '인증번호는 6자리 숫자로만 입력 가능합니다.',
    },
  },
};

export const PasswordResetForm: React.FC = () => {
  const router = useRouter();
  const passwordResetForm = useForm<PasswordResetFormProps>({
    defaultValues: PASSWORD_RESET_FORM_DEFAULT_VALUES,
  });
  const [isVerificationCodeSend, setIsVerificationCodeSend] = useState(false);
  const { authVerificationCodeSendMutation, authPasswordResetMutation } = useAuthMutation();
  const { run, reset, timerStatus, leftTime } = useTimerHook({ time: { minutes: 5 } });

  const leftTimeString = useMemo(() => {
    if (!timerStatus || timerStatus === 'initialized') return;

    const minutes = leftTime.minutes;
    const seconds = leftTime.seconds;

    return `0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }, [timerStatus, leftTime]);

  const onPasswordResetFormSuccess = async (data: PasswordResetFormProps) => {
    try {
      await authPasswordResetMutation.mutateAsync(data);

      router.push(`${ROUTE_URL.auth.passwordReset.result}`);
    } catch (error) {
      if (isBadRequest(error)) {
        error.detail.forEach(({ field }) => {
          switch (field as keyof PasswordResetFormProps) {
            case 'identifier':
              passwordResetForm.setError('identifier', {
                message: VALIDATION.identifier?.required,
              });

              return;
            case 'newPassword':
              passwordResetForm.setError('newPassword', {
                message: VALIDATION.newPassword?.required,
              });

              return;
            case 'newPasswordAccept':
              passwordResetForm.setError('newPasswordAccept', {
                message: VALIDATION.newPasswordAccept?.required,
              });

              return;
            case 'phoneNumber':
              passwordResetForm.setError('phoneNumber', {
                message: VALIDATION.phoneNumber?.required,
              });

              return;
            case 'verificationCode':
              passwordResetForm.setError('verificationCode', {
                message: VALIDATION.verificationCode?.required,
              });

              return;
          }
        });
      }

      if (isValidationFailed(error)) {
        error.detail.forEach(({ field }) => {
          switch (field as keyof PasswordResetFormProps) {
            case 'identifier':
              passwordResetForm.setError('identifier', {
                message: VALIDATION.identifier?.pattern?.message,
              });

              return;
            case 'newPassword':
              passwordResetForm.setError('newPassword', {
                message: VALIDATION.newPassword?.pattern?.message,
              });

              return;
            case 'newPasswordAccept':
              passwordResetForm.setError('newPasswordAccept', {
                message: VALIDATION.newPasswordAccept?.pattern?.message,
              });

              return;
            case 'phoneNumber':
              passwordResetForm.setError('phoneNumber', {
                message: VALIDATION.phoneNumber?.pattern?.message,
              });

              return;
            case 'verificationCode':
              passwordResetForm.setError('verificationCode', {
                message: VALIDATION.verificationCode?.pattern?.message,
              });

              return;
          }
        });
      }

      if (isNotFound(error)) {
        if (error.detail === 'credential') {
          passwordResetForm.setError('phoneNumber', { message: '가입된 정보가 없습니다.' });

          return;
        }

        if (error.detail === 'verfication') {
          passwordResetForm.setError('verificationCode', {
            message: '휴대전화번호 인증 요청 후 다시 시도해주세요.',
          });

          return;
        }
      }

      if (isForbidden(error)) {
        if (error.detail.field === 'verificationCode') {
          if (error.detail.reason === 'INVALID') {
            passwordResetForm.setError('verificationCode', {
              message: '인증번호가 일치하지 않습니다. 다시 한 번 확인해주세요.',
            });

            return;
          } else if (error.detail.reason === 'TIMEOUT') {
            passwordResetForm.setError('verificationCode', {
              message: '인증 시간이 초과되었습니다. 다시 한 번 요청해주세요.',
            });

            return;
          }
        } else if (error.detail.field === 'newPassword') {
          if (error.detail.reason === 'RESTRICTED') {
            passwordResetForm.setError('newPassword', {
              message: '기존의 비밀번호와 같은 비밀번호로 변경할 수 없습니다.',
            });

            return;
          }
        }
      }
    }
  };

  const onPhoneNumberInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = event.target.value;

    if (SPACE_REGEX.test(phoneNumber)) {
      passwordResetForm.setValue('phoneNumber', phoneNumber.replace(SPACE_REGEX, ''));

      return;
    }

    if (EXCEPT_NUMBER_REGEX.test(phoneNumber)) {
      passwordResetForm.setValue('phoneNumber', phoneNumber.replace(EXCEPT_NUMBER_REGEX, ''));

      return;
    }

    if (phoneNumber.length > 11)
      passwordResetForm.setValue('phoneNumber', phoneNumber.slice(0, 11));
  };

  const onVerificationRequestButtonClick = async () => {
    const phoneNumber = passwordResetForm.getValues('phoneNumber');

    setIsVerificationCodeSend(false);

    if (!phoneNumber) {
      passwordResetForm.setError('phoneNumber', { message: VALIDATION.phoneNumber?.required });

      return;
    }

    if (!PHONE_NUMBER_REGEX.test(phoneNumber)) {
      passwordResetForm.setError('phoneNumber', {
        message: VALIDATION.phoneNumber?.pattern?.message,
      });

      return;
    }

    passwordResetForm.clearErrors('phoneNumber');

    try {
      await authVerificationCodeSendMutation.mutateAsync({
        phoneNumber: passwordResetForm.getValues('phoneNumber'),
      });

      reset();
      run();

      setIsVerificationCodeSend(true);
    } catch (error) {
      if (isTooManyRequests(error)) {
        if (isTooManyRequestWithTime(error.detail)) {
          const retryAfterDate = new Date(error.detail.retryAfter);
          const retryAfterSeconds = retryAfterDate.getSeconds();

          passwordResetForm.setError('phoneNumber', {
            message: `인증번호 요청은 1분에 한 번만 가능합니다. 남은 시간은 ${retryAfterSeconds}초 후 입니다.`,
          });
        } else if (isTooManyRequestWithCount(error.detail)) {
          const count = error.detail.count;

          passwordResetForm.setError('phoneNumber', {
            message: `인증번호 요청 횟수가 초과되었습니다. 일 ${count}회까지만 요청이 가능합니다.`,
          });
        }
      }
    }
  };

  return (
    <FormContainer formContext={passwordResetForm} onSuccess={onPasswordResetFormSuccess}>
      <FormItem
        label='휴대전화번호'
        formHandleButtonProps={{
          text: '인증 요청',
          onClick: onVerificationRequestButtonClick,
          disabled: authVerificationCodeSendMutation.isPending,
        }}>
        <TextFieldElement
          name='phoneNumber'
          placeholder='하이폰(-)을 제외한 문자열입니다. 예) 01012345678'
          validation={VALIDATION.phoneNumber}
          onChange={onPhoneNumberInputChange}
          helperText={isVerificationCodeSend ? '인증번호가 발송되었습니다.' : ''}
        />
      </FormItem>
      <S.VerificationCodeInputContainer>
        <TextFieldElement
          name='verificationCode'
          placeholder='전송된 인증번호를 입력해주세요.'
          validation={VALIDATION.verificationCode}
        />
        <S.VerificationTimerContainer>
          <Typography variant='h5'>{leftTimeString}</Typography>
        </S.VerificationTimerContainer>
      </S.VerificationCodeInputContainer>
      <FormItem label='아이디'>
        <TextFieldElement
          name='identifier'
          placeholder='아이디를 입력해주세요.'
          validation={VALIDATION.identifier}
        />
      </FormItem>
      <FormItem label='새로운 비밀번호'>
        <PasswordElement
          name='newPassword'
          placeholder='공백 제외, 8~30자 영문, 숫자 필수 입력(특수 문자 선택 입력)'
          validation={VALIDATION.newPassword}
        />
      </FormItem>
      <FormItem label='비밀번호 확인'>
        <PasswordElement
          name='newPasswordAccept'
          placeholder='비밀번호와 동일하게 입력해주세요.'
          validation={VALIDATION.newPasswordAccept}
        />
      </FormItem>
      <S.PasswordResetButton type='submit' disabled={authPasswordResetMutation.isPending}>
        <Typography fontSize='1rem' fontWeight='bold'>
          비밀번호 재설정
        </Typography>
      </S.PasswordResetButton>
    </FormContainer>
  );
};
