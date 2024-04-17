import { styled } from '@mui/material';

export const Container = styled('div')({
  display: 'flex',
  gap: '0.62rem',
  alignItems: 'center',
  width: '100%',
  '& > .MuiFormControl-root > .MuiFormGroup-root > .MuiFormControlLabel-root': {
    margin: '0 !important',
    '& > p': {
      marginLeft: '.625rem',
    },
  },
});