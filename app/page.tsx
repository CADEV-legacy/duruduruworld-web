'use server';

import Link from 'next/link';

import { ROUTE_URL } from './constant';
import styles from './page.module.css';

import { CommonLayout, SocketComponent } from '@/(client)/component';

const Page: React.FC = () => {
  return (
    <CommonLayout>
      <div className={styles.container}>
        <section className={styles.box}>
          <h1 className={styles.title}>Welcome to StarWalkin&apos;3D</h1>
          <Link className={styles.goToPostButton} href={ROUTE_URL.post.prefix}>
            글 보러가기
          </Link>
          <SocketComponent />
        </section>
      </div>
    </CommonLayout>
  );
};

export default Page;
