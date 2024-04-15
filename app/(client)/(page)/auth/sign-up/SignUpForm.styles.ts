import Link from 'next/link';

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

export const Divider = styled('div')({
  width: '100%',
  height: '0.1875rem',
  backgroundColor: COLOR.divider,
  marginBottom: '0.5rem',
});

export const FormContainer = styled('div')({
  width: '100%',
  marginTop: '1rem',
});

export const SubtitleContainer = styled('div')({
  width: '100%',
  margin: '1.5rem 0 0.5rem',
});

export const AddAnimalGroupIconContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '.25rem',
  width: '100%',
  marginBottom: '1rem',
});

export const AddAnimalGroupIconWrapper = styled('div')({
  position: 'relative',
  width: '1.3125rem',
  height: '1.3125rem',
});

export const AddressDetailInputContainer = styled('div')({
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

export const GenderCustomRadio = styled('div')<{ selected?: boolean }>(({ selected }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'calc((100% - 3.6rem) / 3)',
  height: '2.5rem',
  borderRadius: '0.3125rem',
  border: `${selected ? '.125rem' : '.0625rem'} solid ${selected ? COLOR.themeColor2 : COLOR.inputBorder}`,
  background: COLOR.white,
  '&:hover': {
    borderColor: COLOR.themeColor2Hover,
    cursor: 'pointer',
  },
}));

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

export const AgreementCheckboxContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  width: '100%',
  marginBottom: '2rem',
});

export const AgreementLink = styled(Link)({
  color: COLOR.black,
});

export const SignUpButton = styled(Button)({
  width: '100%',
  height: '3.75rem',
  borderRadius: '0.3125rem',
  borderRight: `.0625rem solid ${COLOR.black}`,
  borderBottom: `.0625rem solid ${COLOR.black}`,
  backgroundColor: COLOR.themeColor2,
  color: COLOR.white,
  '&:hover': {
    backgroundColor: COLOR.themeColor2Hover,
  },
});

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
  zIndex: 999,
});

export const DaumAddressSearchWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '37.5rem',
  padding: '1rem',
  boxSizing: 'border-box',
  backgroundColor: COLOR.white,
});

export const DaumAddressSearchContainer = styled('div')({
  width: '100%',
});
