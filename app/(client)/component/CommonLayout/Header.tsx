import Link from 'next/link';

import { Typography } from '@mui/material';

import styles from './Header.module.css';
import { UserInfo } from './UserInfo';

import { SmartImage } from '@/(client)/component';

import { ROUTE_URL } from '@/constant';

import companyLogoImage from '#/images/company_logo.png';

export const Header: React.FC = () => {
  // TODO: Request user data from server.
  return (
    <header className={styles.header}>
      <Link className={styles.headerLeftBox} href={ROUTE_URL.home}>
        <div className={styles.companyLogoContainer}>
          <SmartImage alt='company-logo' src={companyLogoImage} />
        </div>
        <Typography variant='h5' fontWeight='bold'>
          Star Walkin&apos;
        </Typography>
      </Link>
      <UserInfo name='이산하' />
    </header>
  );
};