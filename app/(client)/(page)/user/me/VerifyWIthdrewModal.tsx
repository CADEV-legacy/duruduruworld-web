import { useRouter } from 'next/navigation';

import { Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

import * as S from './VerifyWithdrewModal.styles';

import { useAuthMutation } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';

import { isValidationFailed } from '@/(error)';

import { COLOR, ROUTE_URL } from '@/constant';

type VerifyWithdrewModalProps = {
  open: boolean;
  password: string;
} & PasswordCheckModalActions;

interface PasswordCheckModalActions {
  onClose: () => void;
}

export const VerifyWithdrewModal: React.FC<VerifyWithdrewModalProps> = ({
  open,
  password,
  onClose,
}) => {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const { authDeleteMutation } = useAuthMutation();

  const onWithdrewButtonClick = async () => {
    try {
      await authDeleteMutation.mutateAsync({ type: 'credential', password });

      clearAuth();

      enqueueSnackbar('회원탈퇴가 완료되었습니다.', { variant: 'success' });

      onClose();
      router.push(ROUTE_URL.home);
    } catch (error) {
      if (
        isValidationFailed(error) &&
        error.detail[0].field === 'password' &&
        error.detail[0].reason === 'NOT_MATCHED'
      ) {
        enqueueSnackbar('비밀번호가 일치하지 않습니다.', { variant: 'error' });
      } else {
        enqueueSnackbar('회원탈퇴에 실패했습니다. 문의하기를 남겨주세요 :(', { variant: 'error' });
      }

      onClose();
    }
  };

  return (
    <S.ModalContainer open={open} onClose={onClose}>
      <S.ModalContent>
        <S.ModalTitleContainer>
          <Typography fontSize='1.5rem' fontWeight='bold'>
            정말로 탈퇴하시겠습니까?
          </Typography>
          <Typography fontSize='0.875rem'>탈퇴하시면 계정 정보 복구가 불가합니다.</Typography>
        </S.ModalTitleContainer>
        <S.ButtonContainer>
          <S.CancelButton onClick={onClose}>
            <Typography fontSize='1.25rem' fontWeight='700' color={COLOR.themeColor2}>
              취 소
            </Typography>
          </S.CancelButton>
          <S.WithdrewButton onClick={onWithdrewButtonClick} disabled={authDeleteMutation.isPending}>
            <Typography fontSize='1.25rem' fontWeight='700' color={COLOR.white}>
              삭 제
            </Typography>
          </S.WithdrewButton>
        </S.ButtonContainer>
      </S.ModalContent>
    </S.ModalContainer>
  );
};
