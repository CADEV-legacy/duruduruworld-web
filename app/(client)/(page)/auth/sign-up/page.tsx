import styles from './page.module.scss';
import { SignUpForm } from './SignUpForm';

const Page: React.FC = () => {
  return (
    <section className={`${styles.container}`}>
      <SignUpForm />
    </section>
  );
};

export default Page;
