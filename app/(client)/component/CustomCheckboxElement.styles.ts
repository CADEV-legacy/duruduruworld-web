import { styled } from '@mui/material';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '0.62rem',
  alignItems: 'center',
  '& > .MuiFormControl-root > .MuiFormGroup-root > .MuiFormControlLabel-root': {
    margin: '0 !important',
    '& > p': {
      marginLeft: '.625rem',
    },
  },
  [theme.breakpoints.down('lg')]: {
    gap: '.5rem',
    '& > .MuiFormControl-root > .MuiFormGroup-root > .MuiFormControlLabel-root': {
      margin: '0 !important',
      '& > p': {
        marginLeft: '0.5rem',
        fontSize: '0.75rem',
      },
    },
  },
}));
