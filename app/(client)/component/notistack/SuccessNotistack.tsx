import { forwardRef } from 'react';

import { Typography } from '@mui/material';
import { SnackbarKey, SnackbarMessage } from 'notistack';

import * as S from './SuccessNotistack.styles';

import { SmartImage } from '@/(client)/component';

import notiSuccessIcon from '#/icons/notiSuccess.svg';

type SuccessNotistackProps = {
  id: SnackbarKey;
  message: SnackbarMessage;
};

export const SuccessNotistack = forwardRef<HTMLDivElement, SuccessNotistackProps>(
  ({ id, message }, ref) => (
    <S.SuccessNotistackContainer key={`success-notistack-${id}`} ref={ref}>
      <S.IconWrapper>
        <SmartImage alt='success-noti-icon' src={notiSuccessIcon} />
      </S.IconWrapper>
      <Typography fontSize='1.25rem' fontWeight='700'>
        {message}
      </Typography>
    </S.SuccessNotistackContainer>
  )
);

SuccessNotistack.displayName = 'SuccessNotistack';
