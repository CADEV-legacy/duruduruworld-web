'use client';

import { Typography } from '@mui/material';

import * as S from './FormItem.styles';

type FormHandleButtonProps = {
  text: string;
} & FormHandleButtonActions;

interface FormHandleButtonActions {
  onClick: () => void;
}

type FormItemProps = {
  label: string;
  formHandleButtonProps?: FormHandleButtonProps;
  children: React.ReactNode;
};

export const FormItem: React.FC<FormItemProps> = ({ label, formHandleButtonProps, children }) => {
  return (
    <S.Container>
      <S.LabelContainer>
        <Typography variant='h4' fontWeight={700}>
          {label}
        </Typography>
      </S.LabelContainer>
      <S.RowContainer>
        <S.InputContainer hasFormHandleButton={!!formHandleButtonProps}>
          {children}
        </S.InputContainer>
        {formHandleButtonProps && (
          <S.HandleButton type='button' onClick={formHandleButtonProps.onClick}>
            {formHandleButtonProps.text}
          </S.HandleButton>
        )}
      </S.RowContainer>
    </S.Container>
  );
};
