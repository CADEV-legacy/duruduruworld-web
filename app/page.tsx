'use server';

import Link from 'next/link';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getQueryClient, userQueryOptions } from './(client)/service';
import { ROUTE_URL } from './constant';
import styles from './page.module.css';

import { CommonLayout, SocketComponent } from '@/(client)/component';

const prefetchData = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(userQueryOptions.count());

  return dehydrate(queryClient);
};

const Page: React.FC = async () => {
  const dehydratedState = await prefetchData();

  return (
    <CommonLayout>
      <HydrationBoundary state={dehydratedState}>
        <div className={styles.container}>
          <section className={styles.box}>
            <h1 className={styles.title}>Welcome to StarWalkin&apos;3D</h1>
            <Link className={styles.goToPostButton} href={ROUTE_URL.post.prefix}>
              글 보러가기
            </Link>
            <SocketComponent />
          </section>
        </div>
      </HydrationBoundary>
    </CommonLayout>
  );
};

export default Page;
