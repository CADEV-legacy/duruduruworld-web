'use client';

import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { useEffect, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy';

import * as S from './VideoPlayer.styles';

import { SmartImage } from '@/(client)/component';

type VideoPlayerProps = ReactPlayerProps & { previewImage?: string | StaticImport };

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  previewImage,
  width,
  height,
  ...reactPlayerProps
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <S.Container>
      {isMounted ? (
        <ReactPlayer width={width ?? '100%'} height={height ?? '100%'} {...reactPlayerProps} />
      ) : (
        <SmartImage alt='video-preview' src={previewImage} />
      )}
    </S.Container>
  );
};
