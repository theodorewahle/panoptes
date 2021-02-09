import React from 'react';
import ReactPlayer from 'react-player';
import styles from './Video.module.scss';

const Video = (props) => {
  const { width, height, title, url } = props;
  let videoWidth, videoHeight;
  // TODO: have prop be option of size in text then convert
  //       to dimensions here
  if (width == null || height == null || url == null) {
    console.error('"width", "height", & "url" params in Video cannot be null');
    return null;
  }
  let displayTitle = title;
  if (displayTitle == null) {
    displayTitle = 'No Title';
  }
  return (
    <div className={styles.videoPlayer}>
      <ReactPlayer url={url} width={videoWidth} height={videoHeight} />
      <div className={styles.title}>{displayTitle}</div>
    </div>
  );
};

export default Video;
