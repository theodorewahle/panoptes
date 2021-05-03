/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPage } from '../pageContainer/pageContainerSlice';
import { setCurCameraIndex, setCurIncidentIndex } from './videoSlice';

import ReactPlayer from 'react-player';
import { animateScroll as scroll } from 'react-scroll';
import { CircularProgress } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import { getImage } from './tempThumbnails/getThumbnail';
import ENV from '../../env';
import styles from './Video.module.scss';
// import { Link } from 'react-router-dom';

const Video = (props) => {
  const dispatch = useDispatch();
  const [loadStatus, setLoadStatus] = useState(ENV.STATUS_WAITING);
  const {
    incidentId,
    startTime,
    endTime,
    width,
    height,
    title,
    objectIdentified,
    timeStamp,
    url,
    isThumbnail,
    videoType,
    pageLink,
    incidentIndex,
    cameraIndex,
  } = props;
  if (width == null || height == null || url == null) {
    return null;
  }
  let displayObjectIdentified = objectIdentified;
  let displayTimeStamp = timeStamp;
  if (displayObjectIdentified == null) {
    displayObjectIdentified = 'No Title';
  }
  if (displayTimeStamp == null) {
    displayTimeStamp = '';
  }
  const onSelect = () => {
    console.log(`incidentId: ${incidentId}`);
    scroll.scrollToTop();
    console.log(`url: ${url}`);
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
  // TODO: statusDisplay will be used when thumbnails are served from API
  let display, statusDisplay, titleDisplay;
  if (isThumbnail) {
    // TODO: this is temporary for demo - there is no status on image
    //       fetching / loading
    display = (
      <img
        src={`http://127.0.0.1:8080/incident/${incidentId}`}
        alt=""
        width={width}
        height={height}
      />
    );
    titleDisplay = (
      <div className={styles.titleContainer}>
        <div className={styles.timeStamp}>{displayTimeStamp}</div>
      </div>
    );
  } else {
    display = (
      <ReactPlayer
        url={url}
        width={width}
        height={height}
        onReady={() => setLoadStatus(ENV.STATUS_DONE)}
        onError={() => setLoadStatus(ENV.STATUS_ERROR)}
      />
    );
    titleDisplay = <div className={styles.cameraTitle}>{title}</div>;
  }

  // if (loadStatus === ENV.STATUS_DONE) {
  //   statusDisplay = null;
  // } else if (loadStatus === ENV.STATUS_WAITING) {
  //   statusDisplay = <CircularProgress />;
  // } else if (loadStatus === ENV.STATUS_ERROR) {
  //   statusDisplay = <ErrorOutlineIcon />;
  // }

  return (
    <div className={styles.videoContainer}>
      <div
        className={styles.video}
        style={{ width, height }}
        onClick={() => onSelect()}
      >
        <div className={styles.status}>{statusDisplay}</div>
        {display}
        {titleDisplay}
      </div>
    </div>
  );
};

export default Video;
