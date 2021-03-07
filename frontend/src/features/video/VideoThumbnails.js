import React from 'react';
import Video from './Video';

import styles from './Video.module.scss';

// TODO: isThumbnail prop is confusing given name of component
const VideoThumbnails = (props) => {
  const { videos, width, height, isThumbnail, videoType, pageLink } = props;
  if (videos == null) return null;
  if (width == null || height == null) {
    return null;
  }
  if (!Array.isArray(videos)) {
    console.error('"videos" param in VideoThumbnails must be an array');
    return null;
  }
  let i = -1;
  const thumbnails = videos.map((video) => {
    i++;
    return (
      <div key={i}>
        <Video
          startTime={video.startTime}
          endTime={video.endTime}
          title={video.title}
          url={video.url}
          width={width}
          height={height}
          isThumbnail={isThumbnail}
          videoType={videoType}
          pageLink={pageLink}
          incidentIndex={video.incidentIndex}
          cameraIndex={video.cameraIndex}
        />
      </div>
    );
  });
  return <div className={styles.videoThumbnails}>{thumbnails}</div>;
};

export default VideoThumbnails;
