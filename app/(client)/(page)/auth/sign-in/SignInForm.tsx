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
import { AuthSignInRequestProps } from '@/(client)/request';
import { useAuthMutation } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';

import { isBadRequest, isForbidden, isNotFound } from '@/(error)';

import { ROUTE_URL } from '@/constant';

type SignInFormProps = Omit<AuthSignInRequestProps<'credential'>, 'type'>;

const SIGN_IN_FORM_DEFAULT_VALUES: SignInFormProps = {
  identifier: '',
  password: '',
  autoSignIn: false,
};

const VALIDATION: {
  [key in keyof SignInFormProps]?: {
    required?: string;
    pattern?: { value: RegExp; message: string };
  };
} = {
  identifier: {
    required: '아이디를 입력해주세요.',
  },
  password: {
    required: '비밀번호를 입력해주세요.',
  },
};

export const SignInForm: React.FC = () => {
  const router = useRouter();
  const signInForm = useForm<SignInFormProps>({ defaultValues: SIGN_IN_FORM_DEFAULT_VALUES });
  const { updateAuth: update } = useAuthStore();
  const { authSignInMutation } = useAuthMutation();

  const onSignInFormSuccess = async ({ identifier, password, autoSignIn }: SignInFormProps) => {
    try {
      const { accessToken } = await authSignInMutation.mutateAsync({
        type: 'credential',
        identifier,
        password,
        autoSignIn: !!autoSignIn,
      });

      update(accessToken);

      router.push(ROUTE_URL.home);
    } catch (error) {
      if (
        isBadRequest(error) ||
        (isForbidden(error) &&
          error.detail.field === 'password' &&
          error.detail.reason === 'UNAUTHORIZED')
      ) {
        signInForm.setError('identifier', {
          message: '아이디 또는 비밀번호가 일치하지 않습니다.',
        });
        signInForm.setError('password', { message: '아이디 또는 비밀번호가 일치하지 않습니다.' });

        return;
      }

      if (
        (isNotFound(error) && (error.detail === 'credential' || error.detail === 'account')) ||
        (isForbidden(error) &&
          error.detail.field === 'accountStatus' &&
          error.detail.reason === 'RESTRICTED')
      ) {
        signInForm.setError('identifier', { message: '존재하지 않는 아이디입니다.' });
      }
    }
  };

  const onSignInFormError = (field: FieldErrors<SignInFormProps>) => {
    console.error('Sign In Form Error', field);
  };

  // TODO: Implement this after ready for kakao login.
  // const onKakaoLoginButtonClick = async () => {
  //   alert('미구현 기능입니다.');
  // };

  const onSignUpButtonClick = () => {
    router.push(ROUTE_URL.auth.signUp);
  };

  return (
    <FormContainer
      formContext={signInForm}
      onSuccess={onSignInFormSuccess}
      onError={onSignInFormError}>
      <FormItem label='아이디'>
        <TextFieldElement
          name='identifier'
          placeholder='아이디를 입력해주세요.'
          validation={VALIDATION.identifier}
        />
      </FormItem>
      <FormItem label='비밀번호'>
        <PasswordElement
          name='password'
          placeholder='비밀번호를 입력해주세요.'
          validation={VALIDATION.password}
        />
      </FormItem>
      <CustomCheckboxElement name='autoSignIn'>
        <Typography fontSize='.75rem'>자동으로 로그인 하고싶어요</Typography>
      </CustomCheckboxElement>
      <S.SupportLinkContainer>
        <S.SupportLink href={ROUTE_URL.auth.findMyIdentifier}>
          <Typography fontSize='.75rem'>아이디 찾기</Typography>
        </S.SupportLink>
        <S.SupportLink href={ROUTE_URL.auth.passwordReset.prefix}>
          <Typography fontSize='.75rem'>비밀번호 재설정</Typography>
        </S.SupportLink>
      </S.SupportLinkContainer>
      <S.LoginButton type='submit'>로그인하기</S.LoginButton>
      {/** TODO: Implement this after ready for kakao login.  */}
      {/* <S.KakaoLoginButton type='button' onClick={onKakaoLoginButtonClick}>
        카카오로 로그인하기
      </S.KakaoLoginButton> */}
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
