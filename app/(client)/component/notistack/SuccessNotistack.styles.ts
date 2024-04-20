import { styled } from '@mui/material';

import { COLOR } from '@/constant';

export const SuccessNotistackContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  minWidth: '30rem',
  maxWidth: '60rem',
  padding: '0 1rem',
  height: '4rem',
  border: `.0625rem solid ${COLOR.success}`,
  boxShadow: `.25rem .25rem 0 0 ${COLOR.whiteAlpha(0.2)}`,
  background: COLOR.white,
  borderRadius: '1rem',
  boxSizing: 'border-box',
});

export const IconWrapper = styled('div')({
  position: 'relative',
  width: '1rem',
  height: '1rem',
  color: COLOR.success,
});
