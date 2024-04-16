'use client';

import { useRouter } from 'next/navigation';
import {
  FieldErrors,
  FormContainer,
  PasswordElement,
  TextFieldElement,
  useForm,
} from 'react-hook-form-mui';

import { Typography } from '@mui/material';

import * as S from './SignInForm.styles';

import { CustomCheckboxElement, FormItem } from '@/(client)/component';
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
    <FormContainer
      formContext={signInForm}
      onSuccess={onSignInFormSuccess}
      onError={onSignInFormError}>
      <FormItem label='아이디'>
        <TextFieldElement name='identifier' placeholder='아이디를 입력해주세요.' required />
      </FormItem>
      <FormItem label='비밀번호'>
        <PasswordElement name='password' placeholder='비밀번호를 입력해주세요.' required />
      </FormItem>
      <CustomCheckboxElement name='autoSignIn'>
        <Typography fontSize='.75rem'>자동으로 로그인 하고싶어요</Typography>
      </CustomCheckboxElement>
      <S.SupportLinkContainer>
        <S.SupportLink href={ROUTE_URL.auth.findMyID}>
          <Typography fontSize='.75rem'>아이디 찾기</Typography>
        </S.SupportLink>
        <S.SupportLink href={ROUTE_URL.auth.passwordReset.prefix}>
          <Typography fontSize='.75rem'>비밀번호 재설정</Typography>
        </S.SupportLink>
      </S.SupportLinkContainer>
      <S.LoginButton type='submit'>로그인하기</S.LoginButton>
      <S.KakaoLoginButton type='button' onClick={onKakaoLoginButtonClick}>
        카카오로 로그인하기
      </S.KakaoLoginButton>
      <S.DividerContainer>
        <S.Divider />
        <S.DividerText>또는</S.DividerText>
      </S.DividerContainer>
      <S.SignUpButton type='button' onClick={onSignUpButtonClick}>
        <Typography fontSize='1rem' fontWeight='bold'>
          회원가입
        </Typography>
      </S.SignUpButton>
    </FormContainer>
  );
};
