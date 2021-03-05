import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPage } from '../pageContainer/pageContainerSlice';
import { setCurCameraIndex, setCurIncidentIndex } from './videoSlice';

import ReactPlayer from 'react-player';
import { CircularProgress } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import ENV from '../../env';
import styles from './Video.module.scss';
// import { Link } from 'react-router-dom';

// TODO: CSS mouse over --> display light box around or something
const Video = (props) => {
  const dispatch = useDispatch();
  const [loadStatus, setLoadStatus] = useState(ENV.STATUS_WAITING);
  const {
    width,
    height,
    title,
    url,
    // isThumbnail,
    videoType,
    pageLink,
    incidentIndex,
    cameraIndex,
  } = props;
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
  if (loadStatus === ENV.STATUS_DONE) {
    display = (
      <ReactPlayer
        url={url}
        width={width}
        height={height}
        onReady={() => setLoadStatus(ENV.STATUS_DONE)}
        onError={() => setLoadStatus(ENV.STATUS_ERROR)}
      />
    );
  } else if (loadStatus === ENV.STATUS_WAITING) {
    display = <CircularProgress />;
  } else if (loadStatus === ENV.STATUS_ERROR) {
    display = <ErrorOutlineIcon />;
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
