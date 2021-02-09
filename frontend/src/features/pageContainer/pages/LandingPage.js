import React from 'react';
import { useSelector } from 'react-redux';
import { selectStreams, selectRecentIncidents } from '../../video/videoSlice';
import VideoThumbnails from '../../video/VideoThumbnails';
import styles from './LandingPage.module.scss';
import ENV from '../../../env';

const LandingPage = () => {
  const streams = useSelector(selectStreams);
  const recentIncidents = useSelector(selectRecentIncidents);
  return (
    <div>
      <div className={styles.containerVideoStreams}>
        <div className={styles.titleVideoStreams}></div>
        <VideoThumbnails
          videos={streams}
          width={ENV.VIDEO_STREAMS_WIDTH}
          height={ENV.VIDEO_STREAMS_HEIGHT}
        />
      </div>
      <div className={styles.containerRecentIncidents}>
        <div className={styles.titleRecentIncidents}></div>
        <VideoThumbnails
          videos={recentIncidents}
          width={ENV.VIDEO_THUMBNAIL_WIDTH}
          height={ENV.VIDEO_THUMBNAIL_HEIGHT}
        />
      </div>
    </div>
  );
};

export default LandingPage;
