import React from 'react';
import { useSelector } from 'react-redux';
import { selectStreamStatus } from './videoSlice';
import ReactPlayer from 'react-player';
import styles from './Video.module.scss';

const Video = () => {
  const streamStatus = useSelector(selectStreamStatus);
  const videoWidth = 640;
  const videoHeight = 360;
  return (
    <div className={styles.container}>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=IcWTPFnqOLo"
        width={videoWidth}
        height={videoHeight}
      />
      <div>Video Stream Hello World</div>
      <div>streamStatus: {streamStatus}</div>
    </div>
  );
};

export default Video;
