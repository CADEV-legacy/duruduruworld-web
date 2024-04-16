import { Typography } from '@mui/material';

import styles from './page.module.scss';
import { PasswordResetForm } from './PasswordResetForm';

import { SmartImage } from '@/(client)/component';

import logoBlack from '#/image/logoBlack.png';

const Page: React.FC = () => {
  return (
    <section className={styles.container}>
      <div className={styles.passwordResetFormContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.titleLogoWrapper}>
            <SmartImage alt='password-reset-logo' src={logoBlack} />
          </div>
          <Typography variant='h1' fontSize='.875rem'>
            비밀번호를 재설정 해드릴게요 :)
          </Typography>
        </div>
        <div className={styles.divider} />
        <PasswordResetForm />
      </div>
    </section>
  );
};

export default Page;
