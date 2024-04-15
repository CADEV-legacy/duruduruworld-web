import NavigationIcon from '@mui/icons-material/Navigation';
import { styled } from '@mui/material';

import { COLOR } from '@/constant';

export const ScrollToTopContainer = styled('div')<{ isVisible: boolean }>(({ isVisible }) => ({
  display: isVisible ? 'block' : 'none',
  position: 'fixed',
  right: '2rem',
  bottom: '2rem',
}));

export const ScrollToTopImageWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '4rem',
  height: '4rem',
  borderRadius: '50%',
  background: 'url(/image/background.jpg) white 10% / contain',
  cursor: 'pointer',
  '&:hover': {},
});

export const CustomNavigationIcon = styled(NavigationIcon)({
  color: COLOR.themeColor2,
  '&:hover': {
    color: COLOR.themeColor2Hover,
  },
});
