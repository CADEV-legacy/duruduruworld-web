'use client';

import { useSnackbar } from 'notistack';

import * as S from './ShareButton.styles';

import { SmartImage } from '@/(client)/component';

import { CLIENT_SETTINGS } from '@/setting';

import shareButton from '#/image/shareButton.png';
import shareButtonHover from '#/image/shareButtonHover.png';

const SHARE_DATA = {
  title: '두루두루 | Duruduru',
  text: '두루두루, 친환경 배변봉투를 무료로 드립니다!',
  url: CLIENT_SETTINGS.DOMAIN,
};

export const ShareButton: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const onShareButtonClick = async () => {
    if (navigator.share && navigator.canShare(SHARE_DATA)) {
      await navigator.share({
        title: '두루두루 | Duruduru',
        text: '두루두루, 친환경 배변봉투를 무료로 드립니다!',
        url: CLIENT_SETTINGS.DOMAIN,
      });

      enqueueSnackbar('공유할 준비가 되었어요 :)');

      return;
    }

    await navigator.clipboard.writeText(CLIENT_SETTINGS.DOMAIN);

    enqueueSnackbar('공유할 준비가 되었어요 :)');
  };

  return (
    <S.ShareButtonImageWrapper onClick={onShareButtonClick}>
      <SmartImage alt='share-button' src={shareButton} hoverSrc={shareButtonHover} />
    </S.ShareButtonImageWrapper>
  );
};
