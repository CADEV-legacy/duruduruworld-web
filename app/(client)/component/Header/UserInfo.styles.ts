import { Menu, MenuItem, styled } from '@mui/material';

import { COLOR } from '@/constant';

export const LoginSkeletonWrapper = styled('div')({
  width: '3.5rem',
  height: '1.8125rem',
});

export const UserIcon = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '2.5rem',
  height: '2.5rem',
  backgroundColor: COLOR.themeColor2,
  borderRadius: '50%',
});

export const CustomMenu = styled(Menu)({
  '& .MuiPaper-root': {
    padding: '1rem 2rem',
    borderRadius: '1.25rem',
    '& .MuiList-root': {
      padding: 0,
    },
  },
});

export const CustomMenuUserIconContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  marginBottom: '1rem',
});

export const CustomMenuUserIcon = styled(UserIcon)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '3rem',
  height: '3rem',
  backgroundColor: COLOR.themeColor2,
  borderRadius: '50%',
});

export const CustomMenuItem = styled(MenuItem)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
