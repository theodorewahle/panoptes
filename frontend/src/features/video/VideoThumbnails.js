import React from 'react';
import { useSelector } from 'react-redux';
import { selectRecentIncidents } from './videoSlice';
import Video from './Video';
import styles from './Video.module.scss';
import ENV from '../../env';

const VideoThumbnails = () => {
  const recentIncidents = useSelector(selectRecentIncidents);
  const thumbnails = recentIncidents.map((video) => {
    return (
      <Video
        width={ENV.VIDEO_THUMBNAIL_WIDTH}
        height={ENV.VIDEO_THUMBNAIL_HEIGHT}
      />
    );
  });
  return <div className={styles.videoThumbnails}>{thumbnails}</div>;
};

export default VideoThumbnails;
