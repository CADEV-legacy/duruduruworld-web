'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { FieldErrors, FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import * as S from './FindMYIDForm.styles';

import { FormItem, SmartImage } from '@/(client)/component';
import { useTimerHook } from '@/(client)/hook';
import { AuthFindMyIDRequestProps } from '@/(client)/request';
import { useAuthMutation } from '@/(client)/service';

import { isTooManyRequests } from '@/(error)';

import { ROUTE_URL } from '@/constant';

import logoBlack from '#/image/logoBlack.png';

type FindMyIDFormProps = AuthFindMyIDRequestProps;

export const FindMyIDForm: React.FC = () => {
  const router = useRouter();
  const findMyIDForm = useForm<FindMyIDFormProps>();
  const { authVerificationCodeSendMutation, authFindMyIDMutation } = useAuthMutation();
  const { run, reset, timerStatus, leftTime } = useTimerHook({ time: { minutes: 5 } });
  const { enqueueSnackbar } = useSnackbar();

  const leftTimeString = useMemo(() => {
    if (!timerStatus || timerStatus === 'initialized') return;

    const minutes = leftTime.minutes;
    const seconds = leftTime.seconds;

    return `0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }, [timerStatus, leftTime]);

  const onFindMyIDFormSuccess = async (data: FindMyIDFormProps) => {
    try {
      const { email } = await authFindMyIDMutation(data);

      router.push(`${ROUTE_URL.auth.findMyID}/${email}`);
    } catch (error) {
      console.info(error);
    }
  };

  const onFindMyIDFormError = (field: FieldErrors<FindMyIDFormProps>) => {
    console.error('Find My ID Form Error', field);
  };

  const onVerificationRequestButtonClick = async () => {
    const phoneNumber = findMyIDForm.getValues('phoneNumber');

    if (!phoneNumber) {
      findMyIDForm.setError('phoneNumber', { message: '인증 요청 전에 핸드폰 번호는 필수입니다.' });

      return;
    }

    findMyIDForm.clearErrors('phoneNumber');

    try {
      await authVerificationCodeSendMutation({
        phoneNumber: findMyIDForm.getValues('phoneNumber'),
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
    <S.Container>
      <S.TitleContainer>
        <S.TitleLogoWrapper>
          <SmartImage alt='find-my-id-logo' src={logoBlack} />
        </S.TitleLogoWrapper>
        <Typography variant='h1' fontSize='.875rem'>
          금방 아이디를 찾아드릴게요!
        </Typography>
      </S.TitleContainer>
      <S.Divider />
      <FormContainer
        formContext={findMyIDForm}
        onSuccess={onFindMyIDFormSuccess}
        onError={onFindMyIDFormError}>
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
        <S.FindMyIDButton type='submit'>아이디 찾기</S.FindMyIDButton>
      </FormContainer>
    </S.Container>
  );
};
