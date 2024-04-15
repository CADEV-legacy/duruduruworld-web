import { Typography } from '@mui/material';

import styles from './index.module.scss';
import { NavigationItem } from './NavigationItem';

import { SmartImage } from '@/(client)/component';

import { COLOR, OUTER_LINK } from '@/constant';

import logoWhite from '#/image/logoWhite.png';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeftContainer}>
        <div className={styles.footerRowFlex}>
          <div className={styles.footerLogoContainer}>
            <SmartImage alt='footer-logo' src={logoWhite} />
          </div>
          <div className={styles.footerColumnFlex}>
            <div className={styles.footerContentFlex}>
              <div className={styles.footerTextFlex}>
                <Typography variant='h5' fontWeight={500} color={COLOR.white}>
                  상호명
                </Typography>
                <Typography variant='h5' fontWeight={300} color={COLOR.white}>
                  두루두루
                </Typography>
              </div>
              <div className={styles.footerTextFlex}>
                <Typography variant='h5' fontWeight={500} color={COLOR.white}>
                  대표자명
                </Typography>
                <Typography variant='h5' fontWeight={300} color={COLOR.white}>
                  김태형
                </Typography>
              </div>
            </div>
            <div className={styles.footerTextFlex}>
              <Typography variant='h5' fontWeight={500} color={COLOR.white}>
                사업장 주소
              </Typography>
              <Typography variant='h5' fontWeight={300} color={COLOR.white}>
                08737 서울특별시 관악구 관악로 24길 14, 5층 27호(봉천동 호삼빌딩)
              </Typography>
            </div>
            <div className={styles.footerContentFlex}>
              <div className={styles.footerTextFlex}>
                <Typography variant='h5' fontWeight={500} color={COLOR.white}>
                  대표 전화
                </Typography>
                <Typography variant='h5' fontWeight={300} color={COLOR.white}>
                  01095605403
                </Typography>
              </div>
              <div className={styles.footerTextFlex}>
                <Typography variant='h5' fontWeight={500} color={COLOR.white}>
                  사업자 등록번호
                </Typography>
                <Typography variant='h5' fontWeight={300} color={COLOR.white}>
                  7171701686
                </Typography>
              </div>
            </div>
            <div className={styles.footerContentFlex}>
              <div className={styles.footerTextFlex}>
                <Typography variant='h5' fontWeight={500} color={COLOR.white}>
                  통신판매업 신고번호
                </Typography>
                <Typography variant='h5' fontWeight={300} color={COLOR.white}>
                  제 2023-서울관악-0846호 [사업자정보확인]
                </Typography>
              </div>
              <div className={styles.footerTextFlex}>
                <Typography variant='h5' fontWeight={500} color={COLOR.white}>
                  개인정보보호책임자
                </Typography>
                <Typography variant='h5' fontWeight={300} color={COLOR.white}>
                  김태형
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerRightContainer}>
        <div className={styles.footerColumnFlex}>
          <NavigationItem name='이용약관' link={OUTER_LINK.termOfUse} />
          <NavigationItem name='개인정보처리방침' link={OUTER_LINK.privacyPolicy} />
          <NavigationItem name='문의하기' link={OUTER_LINK.inquiry} />
          <Typography variant='h4' fontWeight={500} color={COLOR.white}>
            ⓒ 2024 두루두루
          </Typography>
        </div>
      </div>
    </footer>
  );
};
