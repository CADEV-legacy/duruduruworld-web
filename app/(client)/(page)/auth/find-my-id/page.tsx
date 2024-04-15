import { FindMyIDForm } from './FindMyIDForm';
import styles from './page.module.scss';

const Page: React.FC = () => {
  return (
    <section className={styles.container}>
      <FindMyIDForm />
    </section>
  );
};

export default Page;
