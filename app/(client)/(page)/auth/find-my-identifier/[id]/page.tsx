import Link from 'next/link';

import { Typography } from '@mui/material';

import styles from './page.module.scss';

import { AnimationImage, SmartImage } from '@/(client)/component';

import { ROUTE_URL } from '@/constant';

import logoBlack from '#/image/logoBlack.png';
import section1AniDog1 from '#/image/section1AniDog1.png';
import section1AniDog2 from '#/image/section1AniDog2.png';

type PageParams = {
  params: {
    id: string;
  };
};

const Page: React.FC<PageParams> = ({ params: { id } }) => {
  return (
    <section className={styles.container}>
      <div className={styles.findMyIdResultContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.titleLogoWrapper}>
            <SmartImage alt='find-my-id-result-logo' src={logoBlack} />
          </div>
          <div className={styles.titleAniWrapper}>
            <AnimationImage images={[section1AniDog1, section1AniDog2]} />
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.findMyIdResultFlex}>
          <Typography variant='h4'>오늘도 저희 두루두루와 함께해 주셔서 감사해요.</Typography>
          <Typography className={styles.findMyIdResult} variant='h4'>
            회원님의 아이디는 <span>{id}</span> 에요.
          </Typography>
          <Typography variant='h4'>앞으로도 더 좋은 서비스로 보답하도록 노력할게요!</Typography>
        </div>
        <Link className={styles.goToSignInLink} href={ROUTE_URL.auth.signIn}>
          <Typography fontSize='1rem' fontWeight='bold'>
            로그인하러 가기
          </Typography>
        </Link>
        <div className={styles.dividerContainer}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerText}>또는</div>
        </div>
        <Link className={styles.goToResetPasswordLink} href={ROUTE_URL.auth.passwordReset.prefix}>
          <Typography fontSize='1rem' fontWeight='bold'>
            비밀번호 찾기
          </Typography>
        </Link>
      </div>
    </section>
  );
};

export default Page;
