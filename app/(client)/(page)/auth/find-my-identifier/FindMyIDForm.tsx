'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import { Typography } from '@mui/material';

import * as S from './FindMYIDForm.styles';

import { PHONE_NUMBER_REGEX, VERIFICATION_CODE_REGEX } from '@/(server)/util';

import { FormItem } from '@/(client)/component';
import { useTimerHook } from '@/(client)/hook';
import { AuthFindMyIdentifierRequestProps } from '@/(client)/request';
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

type FindMyIDFormProps = AuthFindMyIdentifierRequestProps;

const FIND_MY_ID_FORM_DEFAULT_VALUES: FindMyIDFormProps = {
  phoneNumber: '',
  verificationCode: '',
};

const VALIDATION: {
  [key in keyof FindMyIDFormProps]?: {
    required?: string;
    pattern?: { value: RegExp; message: string };
  };
} = {
  phoneNumber: {
    required: '핸드폰번호를 입력해주세요.',
    pattern: { value: PHONE_NUMBER_REGEX, message: '휴대전화번호가 정확한지 확인해 주세요.' },
  },
  verificationCode: {
    required: '인증번호를 입력해주세요.',
    pattern: {
      value: VERIFICATION_CODE_REGEX,
      message: '인증번호는 6자리 숫자로만 입력 가능합니다.',
    },
  },
};

export const FindMyIDForm: React.FC = () => {
  const router = useRouter();
  const findMyIDForm = useForm<FindMyIDFormProps>({
    defaultValues: FIND_MY_ID_FORM_DEFAULT_VALUES,
  });
  const [isVerificationCodeSend, setIsVerificationCodeSend] = useState(false);
  const { authVerificationCodeSendMutation, authFindMyIdentifierMutation } = useAuthMutation();
  const { run, reset, timerStatus, leftTime } = useTimerHook({ time: { minutes: 5 } });

  const leftTimeString = useMemo(() => {
    if (!timerStatus || timerStatus === 'initialized') return;

    const minutes = leftTime.minutes;
    const seconds = leftTime.seconds;

    return `0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }, [timerStatus, leftTime]);

  const onFindMyIDFormSuccess = async (data: FindMyIDFormProps) => {
    try {
      const { identifier } = await authFindMyIdentifierMutation.mutateAsync(data);

      router.push(`${ROUTE_URL.auth.findMyIdentifier}/${identifier}`);
    } catch (error) {
      if (isBadRequest(error)) {
        error.detail.forEach(({ field }) => {
          switch (field as keyof FindMyIDFormProps) {
            case 'phoneNumber':
              findMyIDForm.setError('phoneNumber', { message: VALIDATION.phoneNumber?.required });

              return;
            case 'verificationCode':
              findMyIDForm.setError('verificationCode', {
                message: VALIDATION.verificationCode?.required,
              });

              return;
          }
        });
      }

      if (isValidationFailed(error)) {
        error.detail.forEach(({ field }) => {
          switch (field as keyof FindMyIDFormProps) {
            case 'phoneNumber':
              findMyIDForm.setError('phoneNumber', {
                message: VALIDATION.phoneNumber?.pattern?.message,
              });

              return;
            case 'verificationCode':
              findMyIDForm.setError('verificationCode', {
                message: VALIDATION.verificationCode?.pattern?.message,
              });

              return;
          }
        });
      }

      if (isNotFound(error)) {
        if (error.detail === 'credential') {
          findMyIDForm.setError('phoneNumber', { message: '가입된 정보가 없습니다.' });

          return;
        }

        if (error.detail === 'verfication') {
          findMyIDForm.setError('verificationCode', {
            message: '휴대전화번호 인증 요청 후 다시 시도해주세요.',
          });

          return;
        }
      }

      if (isForbidden(error) && error.detail.field === 'verificationCode') {
        if (error.detail.reason === 'INVALID') {
          findMyIDForm.setError('verificationCode', {
            message: '인증번호가 일치하지 않습니다. 다시 한 번 확인해주세요.',
          });

          return;
        } else if (error.detail.reason === 'TIMEOUT') {
          findMyIDForm.setError('verificationCode', {
            message: '인증 시간이 초과되었습니다. 다시 한 번 요청해주세요.',
          });

          return;
        }

        return;
      }
    }
  };

  const onPhoneNumberInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = event.target.value;

    if (SPACE_REGEX.test(phoneNumber)) {
      findMyIDForm.setValue('phoneNumber', phoneNumber.replace(SPACE_REGEX, ''));

      return;
    }

    if (EXCEPT_NUMBER_REGEX.test(phoneNumber)) {
      findMyIDForm.setValue('phoneNumber', phoneNumber.replace(EXCEPT_NUMBER_REGEX, ''));

      return;
    }

    if (phoneNumber.length > 11) findMyIDForm.setValue('phoneNumber', phoneNumber.slice(0, 11));
  };

  const onVerificationRequestButtonClick = async () => {
    const phoneNumber = findMyIDForm.getValues('phoneNumber');

    setIsVerificationCodeSend(false);

    if (!phoneNumber) {
      findMyIDForm.setError('phoneNumber', { message: VALIDATION.phoneNumber?.required });

      return;
    }

    if (!PHONE_NUMBER_REGEX.test(phoneNumber)) {
      findMyIDForm.setError('phoneNumber', { message: VALIDATION.phoneNumber?.pattern?.message });

      return;
    }

    findMyIDForm.clearErrors('phoneNumber');

    try {
      await authVerificationCodeSendMutation.mutateAsync({
        phoneNumber: findMyIDForm.getValues('phoneNumber'),
      });

      reset();
      run();

      setIsVerificationCodeSend(true);
    } catch (error) {
      if (isTooManyRequests(error)) {
        if (isTooManyRequestWithTime(error.detail)) {
          const retryAfterDate = new Date(error.detail.retryAfter);
          const retryAfterSeconds = retryAfterDate.getSeconds();

          findMyIDForm.setError('phoneNumber', {
            message: `인증번호 요청은 1분에 한 번만 가능합니다. 남은 시간은 ${retryAfterSeconds}초 후 입니다.`,
          });
        } else if (isTooManyRequestWithCount(error.detail)) {
          const count = error.detail.count;

          findMyIDForm.setError('phoneNumber', {
            message: `인증번호 요청 횟수가 초과되었습니다. 일 ${count}회까지만 요청이 가능합니다.`,
          });
        }
      }
    }
  };

  return (
    <FormContainer formContext={findMyIDForm} onSuccess={onFindMyIDFormSuccess}>
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
      <S.FindMyIDButton type='submit' disabled={authFindMyIdentifierMutation.isPending}>
        <Typography fontSize='1rem' fontWeight='bold'>
          아이디 찾기
        </Typography>
      </S.FindMyIDButton>
    </FormContainer>
  );
};
