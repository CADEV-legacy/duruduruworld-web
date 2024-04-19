'use client';

import { Typography } from '@mui/material';

import * as S from './FormItem.styles';

type FormHandleButtonProps = {
  text: string;
} & FormHandleButtonActions;

interface FormHandleButtonActions {
  disabled?: boolean;
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
          <S.HandleButton
            type='button'
            onClick={formHandleButtonProps.onClick}
            disabled={formHandleButtonProps.disabled}>
            <Typography fontSize='.875rem' fontWeight='bold'>
              {formHandleButtonProps.text}
            </Typography>
          </S.HandleButton>
        )}
      </S.RowContainer>
    </S.Container>
  );
};
