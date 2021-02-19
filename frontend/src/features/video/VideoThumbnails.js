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
  let i = 0;
  const thumbnails = videos.map((video) => {
    i++;
    return (
      <div key={i} onClick={() => props.onSelect(video)}>
        <Video
          width={width}
          height={height}
          url={video.url}
          title={video.title}
        />
      </div>
    );
  });
  return <div className={styles.videoThumbnails}>{thumbnails}</div>;
};

export default VideoThumbnails;
