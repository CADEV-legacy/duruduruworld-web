import { Button, styled } from '@mui/material';

import { COLOR } from '@/constant';

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  paddingBottom: '1.25rem',
});

export const LabelContainer = styled('div')({
  width: '100%',
  marginBottom: '0.5rem',
});

export const RowContainer = styled('div')({
  display: 'flex',
  gap: '1rem',
  marginBottom: '.25rem',
});

export const InputContainer = styled('div')<{ hasFormHandleButton: boolean }>(
  ({ hasFormHandleButton }) => ({
    width: hasFormHandleButton ? 'calc(100% - 8.5rem)' : '100%',
  })
);

export const HandleButton = styled(Button)({
  width: '7.5rem',
  height: '2.5rem',
  backgroundColor: COLOR.themeColor2,
  color: COLOR.white,
  fontWeight: 700,
  lineHeight: 'normal',
  '&:hover': {
    backgroundColor: COLOR.themeColor2Hover,
  },
});
