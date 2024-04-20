import { Typography } from '@mui/material';

import { AccountForm } from './AccountForm';
import { AccountInformationForm } from './AccountInformationForm';
import styles from './page.module.scss';
import { PetInformationForm } from './PetInformationForm';
import { Withdrew } from './Withdrew';

import { SmartImage } from '@/(client)/component';

import myPageUser from '#/image/myPageUser.png';

const Page: React.FC = () => {
  return (
    <div className={styles.container}>
      <section className={styles.accountSection}>
        <div className={styles.accountTitleContainer}>
          <Typography variant='h1' fontSize='1.5rem'>
            계정 정보
          </Typography>
        </div>
        <div className={styles.contentContainer}>
          <AccountForm />
        </div>
      </section>
      <section className={styles.accountInformationSection}>
        <div className={styles.accountInformationTitleContainer}>
          <div className={styles.userImageWrapper}>
            <SmartImage alt='mypage-user-image' src={myPageUser} />
          </div>
          <Typography variant='h1' fontSize='1.5rem'>
            나의 정보
          </Typography>
        </div>
        <div className={styles.contentContainer}>
          <AccountInformationForm />
        </div>
      </section>
      <section className={styles.petInformationSection}>
        <PetInformationForm />
      </section>
      <section className={styles.accountDeleteContainer}>
        <Withdrew />
      </section>
    </div>
  );
};

export default Page;
