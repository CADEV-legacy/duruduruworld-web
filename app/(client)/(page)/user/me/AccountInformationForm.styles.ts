import { Button, styled } from '@mui/material';

import { COLOR, GLOBAL_Z_INDEX } from '@/constant';

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const SmartTypographyContainer = styled('div')({
  width: '100%',
  height: '2.5rem',
});

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

export const EditButton = styled(Button)({
  width: '100%',
  height: '2.5rem',
  marginTop: '1rem',
  backgroundColor: COLOR.themeColor2,
  color: COLOR.white,
  '&:hover': {
    backgroundColor: COLOR.themeColor2Hover,
  },
});

export const UpdateButton = styled(Button)({
  width: '100%',
  height: '2.5rem',
  marginTop: '1rem',
  backgroundColor: COLOR.themeColor2,
  color: COLOR.white,
  '&:hover': {
    backgroundColor: COLOR.themeColor2Hover,
  },
});

export const CancelButton = styled(Button)({
  width: '100%',
  height: '2.5rem',
  marginTop: '1rem',
  backgroundColor: COLOR.themeColor1,
  color: COLOR.white,
  '&:hover': {
    backgroundColor: COLOR.themeColor1Hover,
  },
});
