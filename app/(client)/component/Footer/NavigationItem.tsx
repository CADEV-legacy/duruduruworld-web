import Link from 'next/link';

import { Typography } from '@mui/material';

import styles from './NavigationItem.module.css';

import { COLOR } from '@/constant';

type NavigationItemProps = {
  name: string;
  link: string;
};

export const NavigationItem: React.FC<NavigationItemProps> = ({ name, link }) => {
  return (
    <Link className={styles.navigationItem} href={link} target='_blank'>
      <Typography variant='h4' fontWeight={500} color={COLOR.white}>
        {name}
      </Typography>
    </Link>
  );
};
