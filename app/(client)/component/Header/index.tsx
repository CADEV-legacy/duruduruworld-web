import Link from 'next/link';

import styles from './index.module.css';
import { NavigationItem } from './NavigationItem';
import { UserInfo } from './UserInfo';

import { SmartImage } from '@/(client)/component';

import { ROUTE_URL } from '@/constant';

import logoBlack from '#/images/logoBlack.png';

export const Header: React.FC = async () => {
  return (
    <header className={styles.header}>
      <Link className={styles.headerLogoContainer} href={ROUTE_URL.home}>
        <SmartImage alt='company-logo' src={logoBlack} />
      </Link>
      <div className={styles.headerNavigationContainer}>
        <NavigationItem name='회사소개' link={ROUTE_URL.company.introduction} />
        <NavigationItem name='서비스' link={ROUTE_URL.company.service} />
        <UserInfo />
      </div>
    </header>
  );
};
