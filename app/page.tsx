'use server';

import styles from './page.module.css';

import { CommonLayout, SocketComponent } from '@/(client)/component';

const Page: React.FC = () => {
  return (
    <CommonLayout>
      <div className={styles.container}>
        <section className={styles.box}>
          <SocketComponent />
        </section>
      </div>
    </CommonLayout>
  );
};

export default Page;
