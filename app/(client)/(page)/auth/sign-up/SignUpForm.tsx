'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useRef } from 'react';
import {
  FieldErrors,
  FormContainer,
  PasswordElement,
  RadioButtonGroup,
  TextFieldElement,
  useForm,
} from 'react-hook-form-mui';

import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import * as S from './SignUpForm.styles';

import { useTimerHook } from '@/(client)/hook';
import { AuthSignUpRequestBody } from '@/(client)/request';
import { useAuthMutation } from '@/(client)/service';
import { getCompressedImageFile } from '@/(client)/util';

import { isBadRequest, isForbidden, isTooManyRequests, isValidationFailed } from '@/(error)';

import { COLOR, DIGITAL_FORMAT, ROUTE_URL } from '@/constant';

type SignUpFormProps = Omit<AuthSignUpRequestBody, 'image'> & { passwordAccept: string };

const SIGN_UP_FORM_DEFAULT_VALUES: SignUpFormProps = {
  email: '',
  password: '',
  passwordAccept: '',
  name: '',
  phoneNumber: '',
  age: '',
  gender: 'male',
  postalCode: '',
  address: '',
  addressDetail: '',
  verificationCode: '',
};

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const signUpForm = useForm<SignUpFormProps>({ defaultValues: SIGN_UP_FORM_DEFAULT_VALUES });
  const { enqueueSnackbar } = useSnackbar();
  const daumAddressSearchOverlayRef = useRef<HTMLDivElement>(null);
  const daumAddressSearchWrapperRef = useRef<HTMLDivElement>(null);
  const daumAddressSearchContainerRef = useRef<HTMLDivElement>(null);
  const { run, reset, timerStatus, leftTime } = useTimerHook({ time: { minutes: 5 } });
  const { authSignUpMutation, authDuplicateEmailCheckMutation, authVerificationCodeSendMutation } =
    useAuthMutation();

  const leftTimeString = useMemo(() => {
    if (!timerStatus || timerStatus === 'initialized') return;

    const minutes = leftTime.minutes;
    const seconds = leftTime.seconds;

    return `0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }, [timerStatus, leftTime]);

  const onSignUpFormSuccess = async ({
    email,
    password,
    passwordAccept,
    name,
    phoneNumber,
    age,
    gender,
    postalCode,
    address,
    addressDetail,
    verificationCode,
  }: SignUpFormProps) => {
    try {
      if (password !== passwordAccept) {
        signUpForm.setError('passwordAccept', { message: '비밀번호가 일치하지 않습니다.' });

        return;
      }

      const data = new FormData();

      data.append('email', email);
      data.append('password', password);
      data.append('name', name);
      data.append('phoneNumber', phoneNumber);
      data.append('age', age);
      data.append('gender', gender);
      data.append('postalCode', postalCode);
      data.append('address', address);
      addressDetail && data.append('addressDetail', addressDetail);
      data.append('verificationCode', verificationCode);

      await authSignUpMutation({ data });

      router.push(ROUTE_URL.auth.signIn);
    } catch (error) {
      if (isBadRequest(error)) {
        error.detail.forEach(({ field }) => {
          return signUpForm.setError(field as keyof SignUpFormProps, {
            message: '필수 입력 사항입니다.',
          });
        });
      }

      if (isValidationFailed(error)) {
        error.detail.forEach(({ field, reason }) => {
          switch (reason) {
            case 'REGEX_NOT_MATCHED':
              return signUpForm.setError(field as keyof SignUpFormProps, {
                message: '형식이 맞지 않습니다.',
              });
            default:
              return signUpForm.setError(field as keyof SignUpFormProps, {
                message: reason,
              });
          }
        });
      }

      if (
        isForbidden(error) &&
        error.detail.field === 'verification' &&
        error.detail.reason === 'TIMEOUT'
      ) {
        enqueueSnackbar('인증 시간이 만료되었습니다. 다시 시도해주세요.', { variant: 'error' });
      }
    }
  };

  const onDuplicateCheckButtonClick = async () => {
    const email = signUpForm.getValues('email');

    if (!email) {
      signUpForm.setError('email', { message: '중복확인 전에 입력해주세요' });

      return;
    }

    signUpForm.clearErrors('email');

    const { isDuplicate } = await authDuplicateEmailCheckMutation({ email });

    if (isDuplicate) {
      signUpForm.setError('email', { message: '중복된 이메일입니다.' });

      return;
    }

    enqueueSnackbar('사용 가능한 이메일입니다.');
  };

  const onVerificationRequestButtonClick = async () => {
    const phoneNumber = signUpForm.getValues('phoneNumber');

    if (!phoneNumber) {
      signUpForm.setError('phoneNumber', { message: '인증 요청 전에 핸드폰 번호는 필수입니다.' });

      return;
    }

    signUpForm.clearErrors('phoneNumber');

    try {
      await authVerificationCodeSendMutation({ phoneNumber: signUpForm.getValues('phoneNumber') });

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

  const onSignUpFormError = async (field: FieldErrors<SignUpFormProps>) => {
    console.error('Sign Up Form Error', field);
  };

  const onAddressSearchButtonClick = () => {
    if (
      daumAddressSearchOverlayRef.current === null ||
      daumAddressSearchWrapperRef.current === null ||
      daumAddressSearchContainerRef.current === null
    )
      return;

    daumAddressSearchOverlayRef.current.style.display = 'flex';
    daumAddressSearchWrapperRef.current.style.display = 'flex';
    daumAddressSearchContainerRef.current.style.display = 'block';

    new daum.Postcode({
      oncomplete: function (data) {
        signUpForm.setValue('postalCode', data.zonecode);
        signUpForm.setValue('address', data.address);

        if (
          daumAddressSearchOverlayRef.current === null ||
          daumAddressSearchWrapperRef.current === null ||
          daumAddressSearchContainerRef.current === null
        )
          return;

        daumAddressSearchOverlayRef.current.style.display = 'none';
        daumAddressSearchWrapperRef.current.style.display = 'none';
        daumAddressSearchContainerRef.current.style.display = 'none';
      },
      onresize: size => {
        if (
          daumAddressSearchOverlayRef.current === null ||
          daumAddressSearchWrapperRef.current === null ||
          daumAddressSearchContainerRef.current === null
        )
          return;

        daumAddressSearchContainerRef.current.style.width = `${size.width}px`;
        daumAddressSearchContainerRef.current.style.height = `${size.height}px`;
      },
      width: '100%',
      height: '100%',
      theme: {
        bgColor: COLOR.black,
      },
    }).embed(daumAddressSearchContainerRef.current);
  };

  const onDaumAddressSearchOverlayClick = () => {
    if (
      daumAddressSearchOverlayRef.current === null ||
      daumAddressSearchWrapperRef.current === null ||
      daumAddressSearchContainerRef.current === null
    )
      return;

    daumAddressSearchOverlayRef.current.style.display = 'none';
    daumAddressSearchWrapperRef.current.style.display = 'none';
    daumAddressSearchContainerRef.current.style.display = 'none';
  };

  return (
    <S.Container>
      <S.TitleContainer>
        <Typography variant='h1' fontWeight='bold'>
          회원가입
        </Typography>
        <Typography variant='h5' fontWeight='300' align='right'>
          제가 당신을 기억할 수 있도록 도와주실래요?
        </Typography>
      </S.TitleContainer>
      <FormContainer
        formContext={signUpForm}
        onSuccess={onSignUpFormSuccess}
        onError={onSignUpFormError}>
        <S.FormContainer>
          <S.EmailFormContainer>
            <S.EmailInputContainer>
              <TextFieldElement
                name='email'
                label='Email'
                placeholder='이메일을 입력해주세요'
                required
              />
            </S.EmailInputContainer>
            <S.DuplicateCheckButton type='button' onClick={onDuplicateCheckButtonClick}>
              중복확인
            </S.DuplicateCheckButton>
          </S.EmailFormContainer>
          <PasswordElement
            name='password'
            label='비밀번호'
            placeholder='영문 대,소문자 및 특수문자를 포함한 8-20자리 문자열을 입력하세요'
            required
          />
          <PasswordElement name='passwordAccept' label='비밀번호 확인' required />
          <TextFieldElement name='name' label='이름' required />
          <S.PhoneNumberFormContainer>
            <S.PhoneNumberInputContainer>
              <TextFieldElement
                name='phoneNumber'
                label='핸드폰'
                placeholder='하이폰(-)을 제외한 문자열입니다. (예 - 01012345678)'
                required
              />
            </S.PhoneNumberInputContainer>
            <S.SendVerificationCodeButton type='button' onClick={onVerificationRequestButtonClick}>
              인증번호 요청
            </S.SendVerificationCodeButton>
          </S.PhoneNumberFormContainer>
          <S.VerificationCodeFormContainer>
            <S.VerificationCodeInputContainer>
              <TextFieldElement name='verificationCode' label='인증코드' required />
            </S.VerificationCodeInputContainer>
            <S.VerificationTimerContainer>
              <Typography variant='h5'>{leftTimeString}</Typography>
            </S.VerificationTimerContainer>
          </S.VerificationCodeFormContainer>
          <TextFieldElement name='age' label='나이' required />
          <RadioButtonGroup
            name='gender'
            label='성별'
            valueKey='value'
            options={[
              { id: 'gender-option1', label: '남성', value: 'male' },
              { id: 'gender-option2', label: '여성', value: 'female' },
            ]}
            row
          />
          <TextFieldElement name='postalCode' style={{ height: 0, overflow: 'hidden' }} />
          <S.AddressFormContainer>
            <S.AddressInputContainer>
              <fieldset disabled style={{ backgroundColor: 'transparent', border: 'none' }}>
                <TextFieldElement
                  name='address'
                  label='주소'
                  placeholder='우측 주소검색 버튼을 클릭해주세요 :)'
                  focused
                  required
                />
              </fieldset>
            </S.AddressInputContainer>
            <S.AddressSearchButton type='button' onClick={onAddressSearchButtonClick}>
              주소검색
            </S.AddressSearchButton>
          </S.AddressFormContainer>
          <TextFieldElement
            name='addressDetail'
            label='주소 상세'
            placeholder='상세 주소를 입력해주세요'
            required
          />
        </S.FormContainer>
        <S.SignUpButton type='submit'>함께하기</S.SignUpButton>
      </FormContainer>
      <S.DividerContainer>
        <S.Divider />
        <S.DividerText>OR</S.DividerText>
      </S.DividerContainer>
      <S.GoToSignInPageButton href={ROUTE_URL.auth.signIn}>
        계정이 기억났어요!
      </S.GoToSignInPageButton>
      <S.DaumAddressSearchOverlay
        ref={daumAddressSearchOverlayRef}
        onClick={onDaumAddressSearchOverlayClick}>
        <S.DaumAddressSearchWrapper ref={daumAddressSearchWrapperRef}>
          <S.DaumAddressSearchContainer ref={daumAddressSearchContainerRef} />
        </S.DaumAddressSearchWrapper>
      </S.DaumAddressSearchOverlay>
    </S.Container>
  );
};
