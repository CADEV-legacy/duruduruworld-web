import Link from 'next/link';

import { Hamburger } from './Hamburger';
import styles from './index.module.scss';
import { NavigationItem } from './NavigationItem';
import { UserInfo } from './UserInfo';

import { SmartImage } from '@/(client)/component';

import { ROUTE_URL } from '@/constant';

import logoBlack from '#/image/logoBlack.png';
import logoWhite from '#/image/logoWhite.png';

export const Header: React.FC = async () => {
  return (
    <header className={styles.header}>
      <Link className={styles.headerLogoContainer} href={ROUTE_URL.home}>
        <SmartImage alt='company-logo' src={logoBlack} />
      </Link>
      <Link className={styles.headerLogoContainerMobile} href={ROUTE_URL.home}>
        <SmartImage alt='company-logo' src={logoWhite} />
      </Link>
      <div className={styles.headerNavigationContainer}>
        <NavigationItem name='회사소개' link={ROUTE_URL.company.introduction} />
        <NavigationItem name='서비스' link={ROUTE_URL.company.service} />
        <UserInfo />
      </div>
      <Hamburger />
    </header>
  );
};
