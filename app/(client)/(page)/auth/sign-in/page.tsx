'use server';

import { Typography } from '@mui/material';

import styles from './page.module.scss';
import { SignInForm } from './SignInForm';

import { SmartImage } from '@/(client)/component';

import logoBlack from '#/image/logoBlack.png';
import signInBackground from '#/image/signInBackground.png';
import signInBackgroundMobile from '#/image/signInBackgroundMobile.png';

const Page: React.FC = async () => {
  return (
    <section className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={`${styles.leftContainer} invisible-mobile`}>
          <SmartImage alt='sign-in-image' src={signInBackground} />
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.titleContainer}>
            <div className={styles.titleLogoWrapper}>
              <SmartImage alt='sign-in-logo' src={logoBlack} />
            </div>
            <Typography variant='h1' fontSize='.75rem'>
              &apos;두루두루&apos; 함께하는 즐거움
            </Typography>
          </div>
          <SignInForm />
        </div>
        <div className={`${styles.leftContainer} invisible-pc`}>
          <SmartImage alt='sign-in-image' src={signInBackgroundMobile} />
        </div>
      </div>
    </section>
  );
};

export default Page;
