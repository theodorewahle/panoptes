import React from 'react';
import ReactPlayer from 'react-player';
import styles from './Video.module.scss';
import ENV from '../../env';

const Video = (props) => {
  const { width, height } = props;
  let videoWidth, videoHeight;
  // TODO: have prop be option of size in text then convert
  //       to dimensions here
  if (width == null || height == null) {
    videoWidth = ENV.VIDEO_MAIN_WIDTH;
    videoHeight = ENV.VIDEO_MAIN_HEIGHT;
  }
  return (
    <div className={styles.videoPlayer}>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=IcWTPFnqOLo"
        width={videoWidth}
        height={videoHeight}
      />
    </div>
  );
};

export default Video;
