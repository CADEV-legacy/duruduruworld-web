'use client';

import * as S from './EcoGage.styles';

import { AnimationImage, SmartImage } from '@/(client)/component';

import section3AniDog1 from '#/image/section3AniDog1.png';
import section3AniDog2 from '#/image/section3AniDog2.png';
import section3EcoGage from '#/image/section3EcoGage.png';

type EcoGageProps = {
  value?: number;
};

export const EcoGage: React.FC<EcoGageProps> = ({ value = 0 }) => {
  return (
    <S.EcoGageImageWrapper>
      <SmartImage alt='eco-gage' src={section3EcoGage} />
      <S.AniDogImageContainer percentage={value}>
        <S.AniDogImageWrapper>
          <AnimationImage images={[section3AniDog1, section3AniDog2]} />
        </S.AniDogImageWrapper>
      </S.AniDogImageContainer>
    </S.EcoGageImageWrapper>
  );
};
