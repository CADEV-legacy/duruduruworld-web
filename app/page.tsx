import Link from 'next/link';
import { Metadata } from 'next/types';

import { Typography } from '@mui/material';

import styles from './page.module.scss';

import {
  AnimationImage,
  KoreaEnvironmentMap,
  ShareButton,
  SmartImage,
  SocketUserCount,
} from '@/(client)/component';

import { ROUTE_URL } from '@/constant';

import companyIntroductionButton from '#/images/companyIntroductionButton.png';
import companyIntroductionButtonHover from '#/images/companyIntroductionButtonHover.png';
import joinButton from '#/images/joinButton.png';
import joinButtonHover from '#/images/joinButtonHover.png';
import section1AniDog1 from '#/images/section1AniDog1.png';
import section1AniDog2 from '#/images/section1AniDog2.png';
import section1AniEarth1 from '#/images/section1AniEarth1.png';
import section1AniEarth2 from '#/images/section1AniEarth2.png';
import section1Cloud1 from '#/images/section1Cloud1.png';
import section1Cloud2 from '#/images/section1Cloud2.png';
import section1TextPoint from '#/images/section1TextPoint.png';
import section2Process1 from '#/images/section2Process1.png';
import section2Process2 from '#/images/section2Process2.png';
import section2Process3 from '#/images/section2Process3.png';
import section2Process4 from '#/images/section2Process4.png';
import section4AniImage1 from '#/images/section4AniImage1.png';
import section4AniImage2 from '#/images/section4AniImage2.png';
import serviceIntroductionWebtoonButton from '#/images/serviceIntroductionWebtoonButton.png';
import serviceIntroductionWebtoonButtonHover from '#/images/serviceIntroductionWebtoonButtonHover.png';
import signUpButton from '#/images/signUpButton.png';
import signUpButtonHover from '#/images/signUpButtonHover.png';

export const metadata: Metadata = {
  description: 'ROUTE / PAGE',
};

const Page: React.FC = () => {
  return (
    <div className={styles.container}>
      <section className={`${styles.section} ${styles.relative}`}>
        <Typography
          className={`${styles.section1Title} ${styles.relative}`}
          variant='h1'
          fontSize='4rem'>
          <span>친환경 응가봉투</span>를 <span>무료</span>로 드려요!
          <div className={styles.textPointImageContainer}>
            <div className={styles.textPointImageWrapper}>
              <SmartImage alt='text-point' src={section1TextPoint} />
            </div>
          </div>
          <span className={styles.textPoint}>매달</span>
        </Typography>
        <SocketUserCount />
        <Link href={ROUTE_URL.auth.signUp}>
          <div className={styles.joinButtonImageWrapper}>
            <SmartImage alt='join-button' src={joinButton} hoverSrc={joinButtonHover} />
          </div>
        </Link>
        <div className={styles.section1EarthImageContainer}>
          <div className={styles.section1EarthImageWrapper}>
            <AnimationImage images={[section1AniEarth1, section1AniEarth2]} />
          </div>
        </div>
        <div className={styles.section1DogImageContainer}>
          <div className={styles.section1DogImageWrapper}>
            <AnimationImage images={[section1AniDog1, section1AniDog2]} />
          </div>
        </div>
        <div className={styles.section1Cloud1ImageContainer}>
          <div className={styles.section1CloudImageWrapper}>
            <SmartImage alt='section1-cloud1' src={section1Cloud1} />
          </div>
        </div>
        <div className={styles.section1Cloud2ImageContainer}>
          <div className={styles.section1CloudImageWrapper}>
            <SmartImage alt='section1-cloud2' src={section1Cloud2} />
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <Typography className={styles.section2Title} variant='h1' textAlign='center'>
          후원기업의 <span>카탈로그</span>와 <span>샘플제품</span>이 함께 배송돼요!
        </Typography>
        <Typography className={styles.section2Description} variant='h3' textAlign='center'>
          친환경 응가봉투의 제작비를 후원하는 기업들의 카탈로그와 샘플제품(또는 할인 쿠폰)을 함께
          배송해드려요.
        </Typography>
        <div className={styles.section2ProcessContainer}>
          <div className={styles.section2ProcessContent}>
            <div className={styles.section2ProcessContentImageWrapper}>
              <SmartImage alt='section2-process1' src={section2Process1} />
            </div>
            <Typography variant='h2' textAlign='center'>
              신청자 모집
            </Typography>
            <Typography
              className={styles.section2ProcessContentDescription}
              variant='h3'
              fontSize='1.375rem'
              textAlign='center'>
              회원가입만 하면
              <br />
              자동으로 신청완료
            </Typography>
            <Typography
              className={styles.section2ProcessContentDescription}
              variant='h5'
              textAlign='center'>
              • 도서산간지역은 무료 배송이 어려워
              <br />
              추후 서비스 예정이에요 (ㅠㅠ)
            </Typography>
          </div>
          <div className={styles.section2ProcessContent}>
            <div className={styles.section2ProcessContentImageWrapper}>
              <SmartImage alt='section2-process1' src={section2Process2} />
            </div>
            <Typography variant='h2' textAlign='center'>
              후원기업 모집
            </Typography>
            <Typography
              className={styles.section2ProcessContentDescription}
              variant='h3'
              fontSize='1.375rem'
              textAlign='center'>
              반려가구에 홍보를 원하는
              <br />
              기업 모집 및 제작비 확보
            </Typography>
            <Typography
              className={styles.section2ProcessContentDescription}
              variant='h5'
              textAlign='center'>
              • 후원기업 모집이 되지 않을 경우,
              <br />
              제작 및 발송 일자가 밀릴 수 있어요.
            </Typography>
          </div>
          <div className={styles.section2ProcessContent}>
            <div className={styles.section2ProcessContentImageWrapper}>
              <SmartImage alt='section2-process1' src={section2Process3} />
            </div>
            <Typography variant='h2' textAlign='center'>
              제작
            </Typography>
            <Typography
              className={styles.section2ProcessContentDescription}
              variant='h3'
              fontSize='1.375rem'
              textAlign='center'>
              신청 가구에 배송될
              <br />
              친환경 생분해 배변봉투 제작
            </Typography>
            <Typography
              className={styles.section2ProcessContentDescription}
              variant='h5'
              textAlign='center'>
              • 기본 구성: 친환경 생분해 배변봉투
            </Typography>
          </div>
          <div className={styles.section2ProcessContent}>
            <div className={styles.section2ProcessContentImageWrapper}>
              <SmartImage alt='section2-process1' src={section2Process4} />
            </div>
            <Typography variant='h2' textAlign='center'>
              발송
            </Typography>
            <Typography
              className={styles.section2ProcessContentDescription}
              variant='h3'
              fontSize='1.375rem'
              textAlign='center'>
              배변봉투와 후원기업의
              <br />
              카탈로그, 샘플 등 무료 배송
            </Typography>
            <Typography
              className={styles.section2ProcessContentDescription}
              variant='h5'
              textAlign='center'>
              • 추가 구성: 카탈로그, 샘플, 할인쿠폰 등<br />
              후원기업에 따라 달라져요.
            </Typography>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.section3RowFlex}>
          <div className={styles.section3ColumnFlex}>
            <Typography className={styles.section3Title} variant='h1'>
              친환경 응가봉투가 <span>더 멀리</span>
              <br />
              퍼질 수 있도록 함께해주세요!
            </Typography>
            <Typography className={styles.section3Description} variant='h3'>
              100% 생분해 가능한 응가봉투
              <br />
              우리동네 참여도를 높이면 초록색 땅이 많아져요.
            </Typography>
            <div className={styles.section3EcoGageContainer}>
              <div className={styles.ecoGage}></div>
            </div>
            <div className={styles.shareButtonImageContainer}>
              <ShareButton />
            </div>
          </div>
          <KoreaEnvironmentMap />
        </div>
      </section>
      <section className={styles.section}>
        <Typography className={styles.section4Title} variant='h1' textAlign='center'>
          <span>회원가입</span>만 하면 응가봉투가 도착해요!
        </Typography>
        <Typography className={styles.section4Description} variant='h3' textAlign='center'>
          나와 나의 반려가 행복한 세상을 <span>더 오래</span> 누릴 수 있도록, 함께해주실 수 있나요?
        </Typography>
        <div className={styles.section4ImageContainer}>
          <div className={styles.section4ImageWrapper}>
            <AnimationImage images={[section4AniImage1, section4AniImage2]} />
          </div>
        </div>
        <div className={styles.section4ButtonContainer}>
          <Link href={ROUTE_URL.company.introduction}>
            <div className={styles.companyIntroductionButtonImageWrapper}>
              <SmartImage
                alt='company-introduction-button'
                src={companyIntroductionButton}
                hoverSrc={companyIntroductionButtonHover}
              />
            </div>
          </Link>
          <Link href={ROUTE_URL.company.service}>
            <div className={styles.serviceIntroductionWebtoonButtonImageWrapper}>
              <SmartImage
                alt='service-introduction-webtoon-button'
                src={serviceIntroductionWebtoonButton}
                hoverSrc={serviceIntroductionWebtoonButtonHover}
              />
            </div>
          </Link>
          <Link href={ROUTE_URL.auth.signUp}>
            <div className={styles.signUpButtonImageWrapper}>
              <SmartImage alt='sign-up-button' src={signUpButton} hoverSrc={signUpButtonHover} />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Page;
