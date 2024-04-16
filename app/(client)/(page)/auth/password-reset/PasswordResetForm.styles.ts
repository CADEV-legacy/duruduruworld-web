import { Button, styled } from '@mui/material';

import { COLOR } from '@/constant';

export const VerificationCodeInputContainer = styled('div')({
  position: 'relative',
  marginBottom: '2rem',
});

export const VerificationTimerContainer = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  width: '20%',
  height: '100%',
  paddingRight: '1rem',
});

export const PasswordResetButton = styled(Button)({
  width: '100%',
  height: '3.75rem',
  marginTop: '1rem',
  borderRadius: '0.3125rem',
  borderRight: `.0625rem solid ${COLOR.black}`,
  borderBottom: `.0625rem solid ${COLOR.black}`,
  backgroundColor: COLOR.themeColor2,
  color: COLOR.white,
  '&:hover': {
    backgroundColor: COLOR.themeColor2Hover,
  },
});
