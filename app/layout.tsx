import Script from 'next/script';
import type { Metadata } from 'next/types';

import './global.css';

import styles from './layout.module.css';

import { Footer, Header, Provider } from '@/(client)/component';
import { combinedFontFamily } from '@/(client)/util';

export const metadata: Metadata = {
  title: '두루두루 | Duruduru',
  description: '두루두루, 친환경 배변봉투를 무료로 드립니다!',
};

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang='en'>
      <link rel='icon' href='/favicons/favicon.ico' sizes='any' />
      <body style={{ fontFamily: combinedFontFamily }}>
        <Provider>
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
