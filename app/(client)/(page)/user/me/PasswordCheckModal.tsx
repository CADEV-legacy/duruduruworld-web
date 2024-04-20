import { useState } from 'react';
import { FormContainer, PasswordElement, useForm } from 'react-hook-form-mui';

import { Typography } from '@mui/material';

import * as S from './PasswordCheckModal.styles';
import { VerifyWithdrewModal } from './VerifyWIthdrewModal';

import { PASSWORD_REGEX } from '@/(server)/util';

import { COLOR } from '@/constant';

type PasswordCheckModalProps = {
  open: boolean;
} & PasswordCheckModalActions;

interface PasswordCheckModalActions {
  onClose: () => void;
}

type PasswordCheckFormProps = {
  password: string;
};

const DEFAULT_PASSWORD_FORM_VALUE = {
  password: '',
};

const VALIDATION: {
  [key in keyof PasswordCheckFormProps]?: {
    required?: string;
    pattern?: { value: RegExp; message: string };
  };
} = {
  password: {
    required: '비밀번호를 입력해주세요.',
    pattern: {
      value: PASSWORD_REGEX,
      message: '8-30자의 영문 대/소문자, 숫자, 특수문자 각 1가지 이상의 조합입니다.',
    },
  },
};

export const PasswordCheckModal: React.FC<PasswordCheckModalProps> = ({ open, onClose }) => {
  const passwordCheckForm = useForm<PasswordCheckFormProps>({
    defaultValues: DEFAULT_PASSWORD_FORM_VALUE,
  });
  const [password, setPassword] = useState('');
  const [verifyWithdrewModalOpen, setVerifyWithdrewModalOpen] = useState(false);

  const onPasswhrdCheckFormSuccess = ({ password }: PasswordCheckFormProps) => {
    setPassword(password);
    setVerifyWithdrewModalOpen(true);
  };

  const onVerifyWithdrewModalClose = () => {
    setVerifyWithdrewModalOpen(false);

    setPassword('');

    passwordCheckForm.reset({ password: '' });

    onClose();
  };

  return (
    <S.ModalContainer open={open} onClose={onClose}>
      <S.ModalContent>
        <S.ModalTitleContainer>
          <Typography fontSize='1.5rem' fontWeight='bold'>
            본인확인
          </Typography>
          <Typography fontSize='0.875rem'>본인 확인을 위해 비밀번호를 입력해주세요.</Typography>
        </S.ModalTitleContainer>
        <FormContainer formContext={passwordCheckForm} onSuccess={onPasswhrdCheckFormSuccess}>
          <S.FormContainer>
            <PasswordElement
              name='password'
              placeholder='비밀번호'
              validation={VALIDATION.password}
            />
            <S.CheckButton type='submit'>
              <Typography fontSize='1.25rem' fontWeight='700' color={COLOR.white}>
                확인
              </Typography>
            </S.CheckButton>
          </S.FormContainer>
        </FormContainer>
        <VerifyWithdrewModal
          open={verifyWithdrewModalOpen}
          password={password}
          onClose={onVerifyWithdrewModalClose}
        />
      </S.ModalContent>
    </S.ModalContainer>
  );
};
