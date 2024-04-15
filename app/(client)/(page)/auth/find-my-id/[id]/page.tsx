import { Typography } from '@mui/material';

import styles from './page.module.scss';

import { SmartImage } from '@/(client)/component';

import logoBlack from '#/image/logoBlack.png';

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
          <Typography variant='h1' fontSize='.875rem'>
            도움이 되어서 기뻐요 :)
          </Typography>
        </div>
        <div className={styles.divider} />
        <div className={styles.findMyIdResultFlex}>
          <Typography variant='h4'>두루두루를 이용해 주셔서 감사합니다.</Typography>
          <Typography className={styles.findMyIdResult} variant='h4'>
            회원님의 아이디는 <span>{id}</span> 입니다
          </Typography>
          <Typography variant='h4'>앞으로도 더 좋은 서비스로 보답하겠습니다.</Typography>
        </div>
        <button className={`${styles.goToSignInButton} clickable`}>
          <Typography fontSize='1.25rem' fontWeight='bold'>
            로그인하러 가기
          </Typography>
        </button>
      </div>
    </section>
  );
};

export default Page;
