import { forwardRef } from 'react';

import { Typography } from '@mui/material';
import { SnackbarKey, SnackbarMessage } from 'notistack';

import * as S from './WarningNotistack.styles';

import { SmartImage } from '@/(client)/component';

import notiWarningIcon from '#/icons/notiWarning.svg';

type WarningNotistackProps = {
  id: SnackbarKey;
  message: SnackbarMessage;
};

export const WarningNotistack = forwardRef<HTMLDivElement, WarningNotistackProps>(
  ({ id, message }, ref) => (
    <S.WarningNotistackContainer key={`warning-notistack-${id}`} ref={ref}>
      <S.IconWrapper>
        <SmartImage alt='warning-noti-icon' src={notiWarningIcon} />
      </S.IconWrapper>
      <Typography fontSize='1.25rem' fontWeight='700'>
        {message}
      </Typography>
    </S.WarningNotistackContainer>
  )
);

WarningNotistack.displayName = 'WarningNotistack';
