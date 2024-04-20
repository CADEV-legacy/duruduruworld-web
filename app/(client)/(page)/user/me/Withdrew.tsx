'use client';

import { useState } from 'react';

import { PasswordCheckModal } from './PasswordCheckModal';
import * as S from './Withdrew.styles';

export const Withdrew: React.FC = () => {
  const [passwordCheckModalOpen, setPasswordCheckModalOpen] = useState(false);

  const onWithdrewTextClick = () => {
    setPasswordCheckModalOpen(true);
  };

  return (
    <>
      <S.WithdrewText
        fontSize='1rem'
        align='right'
        onClick={onWithdrewTextClick}
        className='clickable'>
        회원탈퇴
      </S.WithdrewText>
      <PasswordCheckModal
        open={passwordCheckModalOpen}
        onClose={() => setPasswordCheckModalOpen(false)}
      />
    </>
  );
};
