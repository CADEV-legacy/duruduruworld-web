import Link from 'next/link';

import { Button, styled } from '@mui/material';

import { COLOR, GLOBAL_Z_INDEX } from '@/constant';

export const Container = styled('div')({
  width: '100%',
  marginTop: '1rem',
});

export const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
});

export const Divider = styled('div')(({ theme }) => ({
  width: '100%',
  height: '0.1875rem',
  backgroundColor: COLOR.divider,
  marginBottom: '0.5rem',
  [theme.breakpoints.down('lg')]: {
    height: '.125rem',
    marginBottom: '0.25rem',
  },
}));

export const SubtitleContainer = styled('div')(({ theme }) => ({
  width: '100%',
  margin: '1.5rem 0 0.5rem',
  [theme.breakpoints.down('lg')]: {
    margin: '1rem 0 0.5rem',
    '& > p': {
      fontSize: '1rem',
    },
  },
}));

export const SubDescriptionContainer = styled('div')(({ theme }) => ({
  width: '100%',
  marginBottom: '1rem',
  [theme.breakpoints.down('lg')]: {
    marginBottom: '.5rem',
    '& > p': {
      fontSize: '.75rem',
    },
  },
}));

export const PetTypeSelectContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
  width: '100%',
  [theme.breakpoints.down('lg')]: {
    gap: '.5rem',
  },
}));

export const PetTypeTextInputContainer = styled('div')(({ theme }) => ({
  width: '25rem',
  [theme.breakpoints.down('lg')]: {
    width: '12rem',
  },
}));

export const AddAnimalGroupIconContainer = styled('div')({
  display: 'flex',
  flexWrap: 'nowrap',
  padding: '0.5rem 1rem 0',
  width: '100%',
  height: '5.5rem',
  overflowX: 'scroll',
  overflowY: 'hidden',
  marginBottom: '1rem',
});

export const AddAnimalGroupIconWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  flexShrink: 0,
  width: '3.125rem',
  height: '3.125rem',
  transition: 'all ease 0.2s',
  '&:hover': {
    width: '3.375rem',
    height: '3.375rem',
    transform: 'rotate(10deg)',
  },
  [theme.breakpoints.down('lg')]: {
    width: '3.75rem',
    height: '3.75rem',
    '&:hover': {
      width: '4rem',
      height: '4rem',
    },
  },
}));

export const NewAnimalIconContainer = styled('div')<{ hasPet?: boolean }>(({ theme, hasPet }) => ({
  position: 'relative',
  flexShrink: 0,
  marginRight: hasPet ? '3rem' : 0,
  [theme.breakpoints.down('lg')]: {
    marginRight: hasPet ? '1.5rem' : 0,
  },
}));

export const NewAnimalIconWrapper = styled('div')<{ hasPet?: boolean }>(({ theme, hasPet }) => ({
  position: 'relative',
  flexShrink: 0,
  width: hasPet ? '3.125rem' : 0,
  height: hasPet ? '3.125rem' : 0,
  transition: 'all ease 0.2s',
  '&:hover': {
    width: '3.375rem',
    height: '3.375rem',
  },
  [theme.breakpoints.down('lg')]: {
    width: hasPet ? '3.75rem' : 0,
    height: hasPet ? '3.75rem' : 0,
    '&:hover': {
      width: '4rem',
      height: '4rem',
    },
  },
}));

export const DeleteAnimialIconContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '-0.5rem',
  right: '-0.5rem',
  width: '1rem',
  height: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all ease 0.2s',
  '&:hover': {
    width: '1.2rem',
    height: '1.2rem',
    '& > div': {
      width: '1.2rem',
      height: '1.2rem',
    },
  },
  [theme.breakpoints.down('lg')]: {
    width: '1.2rem',
    height: '1.2rem',
    '&:hover': {
      width: '1.5rem',
      height: '1.5rem',
      '& > div': {
        width: '1.5rem',
        height: '1.5rem',
      },
    },
  },
}));

export const DeleteAnimalIconWrapper = styled('div')({
  position: 'relative',
  width: '1rem',
  height: '1rem',
});

export const NewAnimalNameContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  width: '100%',
  [theme.breakpoints.down('lg')]: {
    fontSize: '.75rem',
    top: 'calc(100% + 0.25rem)',
  },
}));

export const AddressDetailInputContainer = styled('div')({
  width: '100%',
  marginBottom: '1.25rem',
});

export const InvisibleRadioContainer = styled('div')({
  display: 'none',
});

export const GenderCustomRadioContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

export const GenderCustomRadio = styled('div')<{ selected?: boolean }>(({ theme, selected }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'calc((100% - 3.6rem) / 3)',
  height: '2.5rem',
  borderRadius: '0.3125rem',
  border: `${selected ? '.125rem' : '.0625rem'} solid ${selected ? COLOR.themeColor2 : COLOR.inputBorder}`,
  background: `${selected ? COLOR.themeColor2 : COLOR.white}`,
  color: `${selected ? COLOR.white : COLOR.black}`,
  '&:hover': {
    borderColor: COLOR.themeColor2Hover,
    cursor: 'pointer',
  },
  [theme.breakpoints.down('lg')]: {
    width: 'calc((100% - 1.2rem) / 3)',
    '& > p': {
      fontSize: '.75rem',
    },
  },
}));

export const VerificationCodeInputContainer = styled('div')({
  width: '100%',
  position: 'relative',
  marginBottom: '2rem',
});

export const VerificationTimerContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  width: '20%',
  height: '100%',
  paddingRight: '1rem',
  [theme.breakpoints.down('lg')]: {
    fontSize: '.75rem',
  },
}));

export const AgreementCheckboxContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginBottom: '2rem',
  [theme.breakpoints.down('lg')]: {
    gap: '0.25rem',
    marginBottom: '1.25rem',
  },
}));

export const AgreementLink = styled(Link)({
  color: COLOR.black,
});

export const SignUpButton = styled(Button)(({ theme }) => ({
  width: '12.5rem',
  height: '2.75rem',
  borderRadius: '0.3125rem',
  borderRight: `.0625rem solid ${COLOR.black}`,
  borderBottom: `.0625rem solid ${COLOR.black}`,
  backgroundColor: COLOR.themeColor2,
  color: COLOR.white,
  '&:hover': {
    backgroundColor: COLOR.themeColor2Hover,
  },
  [theme.breakpoints.down('lg')]: {
    width: '8.125rem',
    height: '2.5rem',
    '& > p': {
      fontSize: '1rem',
    },
  },
}));

export const DaumAddressSearchOverlay = styled('div')({
  display: 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: COLOR.blackAlpha(0.5),
  zIndex: GLOBAL_Z_INDEX.outer,
});

export const DaumAddressSearchWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '37.5rem',
  height: '29.75rem',
  padding: '1rem',
  boxSizing: 'border-box',
  backgroundColor: COLOR.themeColor1,
});

export const DaumAddressSearchContainer = styled('div')({
  width: '100%',
});
