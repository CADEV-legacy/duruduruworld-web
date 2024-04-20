import { Button, styled } from '@mui/material';

import { COLOR } from '@/constant';

export const PetInformationTitleContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '25%',
});

export const PetSliderContainer = styled('div')({
  position: 'relative',
  width: '90%',
  padding: '0 0.5rem',
  height: '8rem',
  marginBottom: '1rem',
});

export const ImageContainer = styled('div')({
  width: '100%',
  height: '8rem',
});

export const ImageAlignContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '6rem',
});

export const ImageTextContainer = styled('div')({
  position: 'absolute',
  left: 0,
  bottom: '-0.5rem',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

export const PetImageContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '6.375rem',
});

export const PetImageWrapper = styled('div')({
  position: 'relative',
  width: '4.5rem',
  height: '6.375rem',
});

export const AddImageWrapper = styled('div')({
  position: 'relative',
  width: '2rem',
  height: '2rem',
});

export const PetContentContainer = styled('div')({
  width: 'calc(100% - 25%)',
  overflow: 'scroll',
});

export const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const PetTypeSelectContainer = styled('div')({
  display: 'flex',
  gap: '1rem',
  width: '100%',
});

export const PetTypeTextInputContainer = styled('div')({
  width: '25rem',
});

const ArrowIconContainer = styled('div')({
  width: '0.875rem',
  height: '1.875rem',
});

export const PrevArrowIconContainer = styled(ArrowIconContainer)({
  position: 'absolute',
  top: 'calc(50% - 0.9375rem)',
  left: 0,
});

export const NextArrowIconContainer = styled(ArrowIconContainer)({
  position: 'absolute',
  top: 'calc(50% - 0.9375rem)',
  right: 0,
});

export const ArrowIconWrapper = styled('div')({
  position: 'relative',
  width: '0.875rem',
  height: '1.875rem',
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

export const DeleteButton = styled(Button)({
  width: '100%',
  height: '2.5rem',
  marginTop: '1rem',
  backgroundColor: COLOR.themeColor1,
  color: COLOR.white,
  '&:hover': {
    backgroundColor: COLOR.themeColor1Hover,
  },
});

export const AddButton = styled(Button)({
  width: '100%',
  height: '2.5rem',
  marginTop: '1rem',
  backgroundColor: COLOR.themeColor1,
  color: COLOR.white,
  '&:hover': {
    backgroundColor: COLOR.themeColor1Hover,
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
