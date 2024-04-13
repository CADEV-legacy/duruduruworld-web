import { Link, Typography } from '@mui/material';

import styles from './NavigationItem.module.css';

type NavigationItemProps = {
  name: string;
  link: string;
};

export const NavigationItem: React.FC<NavigationItemProps> = ({ name, link }) => {
  return (
    <Link className={styles.navigationItem} href={link}>
      <Typography variant='h3' fontSize='1.25rem' fontWeight='700'>
        {name}
      </Typography>
    </Link>
  );
};
