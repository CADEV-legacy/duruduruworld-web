import { styled } from '@mui/material';

export const EcoGageImageWrapper = styled('div')({
  position: 'relative',
  width: '50rem',
  height: '6.25rem',
  padding: '1.94rem 2.5rem 1.06rem',
});

export const AniDogImageContainer = styled('div')<{ percentage: number }>(({ percentage }) => ({
  position: 'absolute',
  top: '-0.5rem',
  left: `${percentage}%`,
}));

export const AniDogImageWrapper = styled('div')({
  position: 'relative',
  width: '6.25rem',
  height: '3.75rem',
});
