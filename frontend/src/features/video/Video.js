import React from 'react';
import { useDispatch } from 'react-redux';
import { setPage } from '../pageContainer/pageContainerSlice';
import { setCurCameraIndex, setCurIncidentIndex } from './videoSlice';

import ReactPlayer from 'react-player';
import VideoThumbnail from 'react-video-thumbnail';

import ENV from '../../env';
import styles from './Video.module.scss';
// import { Link } from 'react-router-dom';

// TODO: CSS mouse over --> display light box around or something
const Video = (props) => {
  const dispatch = useDispatch();
  const {
    width,
    height,
    title,
    url,
    isThumbnail,
    videoType,
    pageLink,
    incidentIndex,
    cameraIndex,
  } = props;
  // TODO: have prop be option of size in text then convert
  //       to dimensions here
  if (width == null || height == null || url == null) {
    return null;
  }
  let displayTitle = title;
  if (displayTitle == null) {
    displayTitle = 'No Title';
  }
  console.log(`videoType: ${videoType}`);
  const onSelect = () => {
    if (videoType === ENV.VIDEO_TYPE_CAMERA) {
      dispatch(setCurCameraIndex(cameraIndex));
    } else if (videoType === ENV.VIDEO_TYPE_INCIDENT) {
      dispatch(setCurCameraIndex(cameraIndex));
      dispatch(setCurIncidentIndex(incidentIndex));
    }
    if (pageLink !== ENV.PAGE_NO_LINK) {
      dispatch(setPage(pageLink));
    }
  };

  let display;
  if (isThumbnail) {
    display = (
      <VideoThumbnail
        videoUrl={url}
        width={width}
        height={height}
        thumbnailHandler={(thumbnail) => console.log(thumbnail)}
      />
    );
  } else {
    display = <ReactPlayer url={url} width={width} height={height} />;
  }
  // const isThumbnail = url.includes('.jpg');

  return (
    <div
      onClick={() => onSelect()}
      className={styles.video}
      style={{ width, height }}
    >
      {display}
      <div className={styles.title}>{displayTitle}</div>
    </div>
  );
};

export default Video;
