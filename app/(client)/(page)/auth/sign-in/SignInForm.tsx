'use client';

import { useRouter } from 'next/navigation';
import {
  CheckboxElement,
  FieldErrors,
  FormContainer,
  PasswordElement,
  TextFieldElement,
  useForm,
} from 'react-hook-form-mui';

import { Typography } from '@mui/material';

import * as S from './SignInForm.styles';

import { AuthSignInRequestProps, authSignInRequest } from '@/(client)/request';
import { useAuthStore } from '@/(client)/store';

import { ROUTE_URL } from '@/constant';

type SignInFormProps = Omit<AuthSignInRequestProps, 'autoSignIn'> & { autoSignIn?: boolean };

const SIGN_IN_FORM_DEFAULT_VALUES: SignInFormProps = {
  email: '',
  password: '',
  autoSignIn: false,
};

export const SignInForm: React.FC = () => {
  const router = useRouter();
  const signInForm = useForm<SignInFormProps>({ defaultValues: SIGN_IN_FORM_DEFAULT_VALUES });
  const { updateAuth: update } = useAuthStore();

  const onSignInFormSuccess = async ({ email, password, autoSignIn }: SignInFormProps) => {
    try {
      const { accessToken } = await authSignInRequest({
        email,
        password,
        autoSignIn: !!autoSignIn,
      });

      update(accessToken);

      router.push(ROUTE_URL.home);
    } catch (error) {
      // TODO: Handle error.
      console.info(error);
    }
  };

  const onSignInFormError = (field: FieldErrors<SignInFormProps>) => {
    console.error('Sign In Form Error', field);
  };

  const onKakaoLoginButtonClick = async () => {
    alert('미구현 기능입니다.');
  };

  const onSignUpButtonClick = () => {
    router.push(ROUTE_URL.auth.signUp);
  };

  return (
    <S.Container>
      <S.TitleContainer>
        <Typography variant='h1' fontWeight='bold'>
          로그인
        </Typography>
        <Typography variant='h5' fontWeight='300' align='right'>
          환영해요! 다시 와주셔서 기뻐요
        </Typography>
      </S.TitleContainer>
      <FormContainer
        formContext={signInForm}
        onSuccess={onSignInFormSuccess}
        onError={onSignInFormError}>
        <S.FormContainer>
          <TextFieldElement name='email' label='Email' required />
          <PasswordElement name='password' label='비밀번호' type='password' required />
          <CheckboxElement name='autoSignIn' label='재방문을 위해 기억해주세요' />
          <S.LoginButton type='submit'>이메일로 로그인하기</S.LoginButton>
          <S.KakaoLoginButton onClick={onKakaoLoginButtonClick}>
            카카오로 로그인하기
          </S.KakaoLoginButton>
        </S.FormContainer>
      </FormContainer>
      <S.DividerContainer>
        <S.Divider />
        <S.DividerText>OR</S.DividerText>
      </S.DividerContainer>
      <S.SignUpButton onClick={onSignUpButtonClick}>회원가입</S.SignUpButton>
    </S.Container>
  );
};
