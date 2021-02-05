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
    <div className={styles.videoPlayer} style={{ marginRight: 16, marginLeft: 16}}>
      <ReactPlayer
        url="http://127.0.0.1:8000/static"
        width={videoWidth}
        height={videoHeight}
      />
      <img src="http://127.0.0.1:8000/vision" width="100%"></img>
    </div>
  );
};

export default Video;
