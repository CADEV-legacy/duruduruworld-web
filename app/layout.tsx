import { cookies } from 'next/headers';
import Script from 'next/script';
import type { Metadata, Viewport } from 'next/types';

import './global.css';

import styles from './layout.module.scss';

import { Footer, Header, Provider } from '@/(client)/component';
import { combinedFontFamily } from '@/(client)/util';

import { COOKIE_KEY } from '@/constant';
import { SERVER_SETTINGS } from '@/setting';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: '두루두루 | Duruduru',
  description: '두루두루, 친환경 배변봉투를 무료로 드립니다!',
  metadataBase: new URL(SERVER_SETTINGS.DOMAIN),
};

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const cookieStore = cookies();

  const hasAuth = !!cookieStore.get(COOKIE_KEY.refreshToken);

  return (
    <html lang='en'>
      <link rel='icon' href='/favicon/favicon.ico' sizes='any' />
      <body style={{ fontFamily: combinedFontFamily }}>
        <Provider hasAuth={hasAuth}>
          <div className={styles.globalLayout}>
            <Header />
            <main className={styles.main}>{children}</main>
            <Footer />
          </div>
        </Provider>
      </body>
      <Script src='//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js' />
    </html>
  );
};

export default Layout;
