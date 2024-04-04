import Script from 'next/script';
import type { Metadata } from 'next/types';

import './global.css';

import { Provider } from '@/(client)/component';
import { combinedFontFamily } from '@/(client)/util';

export const metadata: Metadata = {
  title: 'Next.js Project Template',
  description: 'Generated by Sanha Lee',
};

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang='en'>
      <body style={{ fontFamily: combinedFontFamily }}>
        <link rel='icon' href='/favicons/favicon.ico' sizes='any' />
        <div id='global-layout'>
          <Provider>{children}</Provider>
        </div>
      </body>
      <Script src='//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js' />
    </html>
  );
};

export default Layout;
