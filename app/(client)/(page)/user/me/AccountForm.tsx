'use client';

import { useMemo } from 'react';

import * as S from './AccountForm.styles';

import { FormItem, SmartTypography } from '@/(client)/component';
import { useUserMe } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';
import { dateToShortString } from '@/(client)/util';

import { ACCOUNT_STATUS_NAME, ACCOUNT_TYPE_NAME } from '@/constant';

export const AccountForm: React.FC = () => {
  const { accessToken } = useAuthStore();
  const { data } = useUserMe(accessToken);

  const accountData = useMemo(() => data?.account, [data]);

  return (
    <S.Container>
      <FormItem label='계정 타입'>
        <S.SmartTypographyContainer>
          <SmartTypography
            fontSize='1.25rem'
            text={accountData ? ACCOUNT_TYPE_NAME[accountData.type] : undefined}
          />
        </S.SmartTypographyContainer>
      </FormItem>
      <FormItem label='계정 상태'>
        <S.SmartTypographyContainer>
          <SmartTypography
            fontSize='1.25rem'
            text={accountData ? ACCOUNT_STATUS_NAME[accountData.status] : undefined}
          />
        </S.SmartTypographyContainer>
      </FormItem>
      <FormItem label='계정 생성일자'>
        <S.SmartTypographyContainer>
          <SmartTypography
            fontSize='1.25rem'
            text={accountData ? dateToShortString(accountData.createdAt) : undefined}
          />
        </S.SmartTypographyContainer>
      </FormItem>
    </S.Container>
  );
};
