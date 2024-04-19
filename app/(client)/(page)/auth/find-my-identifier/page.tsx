import { Typography } from '@mui/material';

import { FindMyIDForm } from './FindMyIDForm';
import styles from './page.module.scss';

import { SmartImage } from '@/(client)/component';

import logoBlack from '#/image/logoBlack.png';

const Page: React.FC = () => {
  return (
    <section className={styles.container}>
      <div className={styles.findMyIdFormContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.titleLogoWrapper}>
            <SmartImage alt='password-reset-logo' src={logoBlack} />
          </div>
          <Typography variant='h1' fontSize='.875rem'>
            금방 아이디를 찾아드릴게요!
          </Typography>
        </div>
        <div className={styles.divider} />
        <FindMyIDForm />
      </div>
    </section>
  );
};

export default Page;
