import { Button, styled } from '@mui/material';

import { COLOR } from '@/constant';

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '43.75rem',
  backgroundColor: COLOR.white,
  borderRadius: '1.875rem',
  padding: '2.5rem 5rem 7rem',
  boxShadow: `.5rem .625rem .375rem 0 ${COLOR.blackAlpha(0.42)}`,
  overflow: 'hidden',
});

export const TitleContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '0.5rem',
});

export const TitleLogoWrapper = styled('div')({
  position: 'relative',
  width: '8.75rem',
  height: '2.8875rem',
});

export const Divider = styled('div')({
  width: '100%',
  height: '.125rem',
  backgroundColor: COLOR.divider,
  marginBottom: '2rem',
});

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

export const FindMyIDButton = styled(Button)({
  width: '100%',
  height: '3rem',
  borderRadius: '0.3125rem',
  borderRight: `.0625rem solid ${COLOR.black}`,
  borderBottom: `.0625rem solid ${COLOR.black}`,
  backgroundColor: COLOR.themeColor2,
  color: COLOR.white,
  '&:hover': {
    backgroundColor: COLOR.themeColor2Hover,
  },
});
