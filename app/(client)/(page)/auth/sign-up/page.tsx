import { Typography } from '@mui/material';

import styles from './page.module.scss';
import { SignUpForm } from './SignUpForm';

const Page: React.FC = () => {
  return (
    <section className={styles.container}>
      <div className={styles.signUpFormContainer}>
        <div className={styles.titleContainer}>
          <Typography variant='h1' fontSize='2rem'>
            회원가입
          </Typography>
          <Typography variant='h5' fontWeight='300'>
            제가 당신을 기억할 수 있도록 도와주실래요?
          </Typography>
        </div>
        <div className={styles.divider} />
        <Typography variant='h5'>*는 필수 입력 정보입니다</Typography>
        <SignUpForm />
      </div>
    </section>
  );
};

export default Page;
