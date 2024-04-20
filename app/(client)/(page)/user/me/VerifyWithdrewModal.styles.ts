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

export const ButtonContainer = styled('div')({
  display: 'flex',
  gap: '3.6rem',
});

export const CancelButton = styled(Button)({
  width: '8.5rem',
  height: '2.75rem',
  border: `.25rem solid ${COLOR.themeColor2}`,
  '&:hover': {
    border: `.25rem solid ${COLOR.themeColor2Hover}`,
  },
});

export const WithdrewButton = styled(Button)({
  width: '8.5rem',
  height: '2.75rem',
  backgroundColor: COLOR.themeColor2,
  '&:hover': {
    backgroundColor: COLOR.themeColor2Hover,
  },
});
