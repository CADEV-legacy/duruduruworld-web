import styles from './page.module.scss';

import { VideoPlayer } from '@/(client)/component';

import { OUTER_LINK } from '@/constant';

const Page: React.FC = () => {
  return (
    <div>
      <h1>서비스소개</h1>
      <p>서비스소개 페이지입니다.</p>
      <div className={styles.youtubeContainer}>
        <VideoPlayer muted={true} playing={true} url={OUTER_LINK.youtubeContent} />
      </div>
    </div>
  );
};

export default Page;
