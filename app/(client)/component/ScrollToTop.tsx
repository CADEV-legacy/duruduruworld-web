'use client';

import { useEffect, useState } from 'react';

import * as S from './ScrollToTop.styles';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onScrollToTopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollListener = () => {
    if (window.scrollY > 600) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', scrollListener);

    return () => {
      document.removeEventListener('scroll', scrollListener);
    };
  }, []);

  return (
    <S.ScrollToTopContainer isVisible={isVisible} onClick={onScrollToTopClick}>
      <S.ScrollToTopImageWrapper>
        <S.CustomNavigationIcon fontSize='large' />
      </S.ScrollToTopImageWrapper>
    </S.ScrollToTopContainer>
  );
};
