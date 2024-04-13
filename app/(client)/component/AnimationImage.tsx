'use client';

import { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';

import { SmartImage } from '.';

import { MILLISECOND_TIME_FORMAT } from '@/constant';

type ImageSRC = StaticImageData | string;

type AnimationImageProps = {
  images: ImageSRC[];
};

export const AnimationImage = ({ images }: AnimationImageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        if (prev + 1 === images.length) {
          return 0;
        }

        return prev + 1;
      });
    }, MILLISECOND_TIME_FORMAT.seconds(0.8));

    return () => {
      clearInterval(interval);
    };
  }, [images]);

  return (
    <SmartImage alt={`animation-image-${images[0].toString()}`} src={images[currentImageIndex]} />
  );
};
