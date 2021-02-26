import React from 'react';
import Video from './Video';
import styles from './Video.module.scss';

// TODO probably combine with Video.js file
// TODO: isThumbnail prop is confusing given name of component
const VideoThumbnails = (props) => {
  const { videos, width, height, isThumbnail } = props;
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
      <div key={i}>
        <Video
          title={video.title}
          url={video.url}
          width={width}
          height={height}
          isThumbnail={isThumbnail}
        />
      </div>
    );
  });
  return <div className={styles.videoThumbnails}>{thumbnails}</div>;
};

export default VideoThumbnails;
