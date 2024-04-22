import { styled } from '@mui/material';

export const EcoGageImageWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '50rem',
  height: '6.25rem',
  padding: '1.94rem 2.5rem 1.06rem',
  [theme.breakpoints.down('lg')]: {
    width: '100%',
    height: '5rem',
    padding: '0',
  },
}));

export const AniDogImageContainer = styled('div')<{ percentage: number }>(
  ({ theme, percentage }) => ({
    position: 'absolute',
    top: '-0.5rem',
    left: `${percentage}%`,
    [theme.breakpoints.down('lg')]: {
      top: '0.5rem',
    },
  })
);

export const AniDogImageWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '6.25rem',
  height: '3.75rem',
  [theme.breakpoints.down('lg')]: {
    width: '4rem',
    height: '2.375rem',
  },
}));
