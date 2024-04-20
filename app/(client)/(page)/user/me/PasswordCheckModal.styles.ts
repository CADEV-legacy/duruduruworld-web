import { Button, Modal, styled } from '@mui/material';

import { COLOR } from '@/constant';

export const ModalContainer = styled(Modal)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

export const ModalContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '36rem',
  height: '23rem',
  padding: '0 6rem',
  borderRadius: '1.875rem',
  boxShadow: `0 .25rem .25rem 0 ${COLOR.blackAlpha(0.25)}`,
  backgroundColor: COLOR.white,
});

export const ModalTitleContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  alignItems: 'center',
  width: '100%',
  marginBottom: '2rem',
});

export const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.5rem',
  width: '100%',
});

export const CheckButton = styled(Button)({
  width: '8.5rem',
  height: '2.75rem',
  backgroundColor: COLOR.themeColor2,
  '&:hover': {
    backgroundColor: COLOR.themeColor2Hover,
  },
});
