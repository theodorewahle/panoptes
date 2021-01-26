import React from 'react';
import { useSelector } from 'react-redux';
import { selectStreamStatus } from './videoSlice';
import styles from './Video.module.scss';

const Video = () => {
  const streamStatus = useSelector(selectStreamStatus);

  return (
    <div className={styles.container}>
      <div>Video Stream Hello World</div>
      <div>streamStatus: {streamStatus}</div>
    </div>
  );
};

export default Video;
