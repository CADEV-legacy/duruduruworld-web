'use client';

import { Skeleton, Typography, TypographyProps } from '@mui/material';

type SmartTypographyProps = { text?: string } & TypographyProps;

export const SmartTypography: React.FC<SmartTypographyProps> = ({
  text,

  ...props
}) => {
  return text ? (
    <Typography variant={props.variant ?? 'h3'} {...props}>
      {text}
    </Typography>
  ) : (
    <Skeleton variant='rounded' animation='wave' />
  );
};
