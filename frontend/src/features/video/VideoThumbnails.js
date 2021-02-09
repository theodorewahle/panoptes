import React from 'react';
import Video from './Video';
import styles from './Video.module.scss';

// TODO probably combine with Video.js file
const VideoThumbnails = (props) => {
  const { videos, width, height } = props;
  if (videos == null) return null;
  if (width == null || height == null) {
    console.error('"width" & "height" params required in VideoThumbnails');
    return null;
  }
  if (!Array.isArray(videos)) {
    console.error('"videos" param in VideoThumbnails must be an array');
    return null;
  }
  const thumbnails = videos.map((video) => {
    return (
      <Video
        width={width}
        height={height}
        url={video.url}
        title={video.title}
      />
    );
  });
  return <div className={styles.videoThumbnails}>{thumbnails}</div>;
};

export default VideoThumbnails;
