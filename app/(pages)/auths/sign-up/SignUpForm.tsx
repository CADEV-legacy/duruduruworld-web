'use client';

import {
  FieldErrors,
  FormContainer,
  PasswordElement,
  RadioButtonGroup,
  TextFieldElement,
  useFormContext,
} from 'react-hook-form-mui';

import { Button } from '@mui/material';

import * as S from './SignUpForm.styles';

type SignUpFormContextProps = {
  email: string;
  password: string;
  passwordAccept: string;
  name: string;
  phoneNumber: string;
  age: string;
  gender: string;
  address: string;
};

const SIGN_UP_FORM_DEFAULT_VALUES: SignUpFormContextProps = {
  email: '',
  password: '',
  passwordAccept: '',
  name: '',
  phoneNumber: '',
  age: '',
  gender: 'male',
  address: '',
};

export const SignUpForm: React.FC = () => {
  const signUpFormContext = useFormContext<SignUpFormContextProps>();

  const onSignUpFormSuccess = async (formData: SignUpFormContextProps) => {
    console.info('Sign Up Form Success', formData);
  };

  const onSignUpFormError = async (field: FieldErrors<SignUpFormContextProps>) => {
    console.error('Sign Up Form Error', field);
  };

  return (
    <S.SignUpFormContainer>
      <FormContainer
        context={signUpFormContext}
        defaultValues={SIGN_UP_FORM_DEFAULT_VALUES}
        onSuccess={onSignUpFormSuccess}
        onError={onSignUpFormError}>
        <TextFieldElement name='email' label='Email' required />
        <PasswordElement name='password' label='비밀번호' type='password' required />
        <PasswordElement name='passwordConfirm' label='비밀번호 확인' type='password' required />
        <TextFieldElement name='name' label='이름' required />
        <TextFieldElement name='phoneNumber' label='핸드폰' />
        <TextFieldElement name='age' label='나이' />
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
        <TextFieldElement name='address' label='주소' />
        <Button type='submit'>회원가입</Button>
      </FormContainer>
    </S.SignUpFormContainer>
  );
};
