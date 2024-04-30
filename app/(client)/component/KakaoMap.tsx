'use client';

import Script from 'next/script';
import { useRef } from 'react';

import * as S from './KakaoMap.styles';

import { CLIENT_SETTINGS } from '@/setting';

export const KakaoMap: React.FC = () => {
  const kakaoMapRef = useRef<kakao.maps.Map | null>(null);
  const kakaoMapContainerRef = useRef<HTMLDivElement>(null);

  const onReadyKakaoMap = () => {
    if (!window.kakao) throw new Error('kakao is not initialized');

    if (!kakaoMapContainerRef.current) throw new Error('kakaoMapContainerRef is not initialized');

    window.kakao.maps.load(() => {
      const KAKAO_MAP_OPTIONS: kakao.maps.MapOptions = {
        center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
        level: 3,
      };

      kakaoMapRef.current = new window.kakao.maps.Map(
        kakaoMapContainerRef.current,
        KAKAO_MAP_OPTIONS
      );
    });
  };

  return (
    <S.Container ref={kakaoMapContainerRef}>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${CLIENT_SETTINGS.KAKAO_APP_KEY}&autoload=false`}
        onReady={onReadyKakaoMap}
      />
    </S.Container>
  );
};
