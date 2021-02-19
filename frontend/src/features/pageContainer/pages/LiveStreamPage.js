import React from 'react';
import { useSelector } from 'react-redux';
import { selectRecentIncidents } from '../../video/videoSlice';
import VideoThumbnails from '../../video/VideoThumbnails';
import styles from './LandingPage.module.scss';
import ENV from '../../../env';

const LiveStreamPage = () => {
  const recentIncidents = useSelector(selectRecentIncidents);

  return (
    <div>
      <div className={styles.containerRecentIncidents}>
        <div className={styles.titleRecentIncidents}>Recent Incidents</div>
        <VideoThumbnails
          videos={recentIncidents}
          width={ENV.VIDEO_THUMBNAIL_WIDTH}
          height={ENV.VIDEO_THUMBNAIL_HEIGHT}
        />
      </div>
    </div>
  );
};

export default LiveStreamPage;
