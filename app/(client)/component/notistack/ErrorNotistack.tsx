import { forwardRef } from 'react';

import { Typography } from '@mui/material';
import { SnackbarKey, SnackbarMessage } from 'notistack';

import * as S from './ErrorNotistack.styles';

import { SmartImage } from '@/(client)/component';

import notiErrorIcon from '#/icons/notiError.svg';

type ErrorNotistackProps = {
  id: SnackbarKey;
  message: SnackbarMessage;
};

export const ErrorNotistack = forwardRef<HTMLDivElement, ErrorNotistackProps>(
  ({ id, message }, ref) => (
    <S.ErrorNotistackContainer key={`error-notistack-${id}`} ref={ref}>
      <S.IconWrapper>
        <SmartImage alt='error-noti-icon' src={notiErrorIcon} />
      </S.IconWrapper>
      <Typography fontSize='1.25rem' fontWeight='700'>
        {message}
      </Typography>
    </S.ErrorNotistackContainer>
  )
);

ErrorNotistack.displayName = 'ErrorNotistack';
