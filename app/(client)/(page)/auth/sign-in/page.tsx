'use server';

import styles from './page.module.scss';
import { SignInForm } from './SignInForm';

const Page: React.FC = async () => {
  return (
    <section className={`${styles.container} scrollableY`}>
      <SignInForm />
    </section>
  );
};

export default Page;
