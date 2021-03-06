import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatusMainDataModel } from '../../../video/videoSlice';

import VideoThumbnails from '../../../video/VideoThumbnails';
import { CircularProgress } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import styles from './LandingPage.module.scss';
import ENV from '../../../../env';

const Loading = () => {
  return (
    <div className={styles.loading}>
      <CircularProgress color={'inherit'} size={100} />
    </div>
  );
};

const Error = (props) => {
  const { type } = props;
  let message;
  if (type != null && type === 'unknown') {
    message = 'Unknown error fetching and processing data';
  } else {
    message = 'Error Fetching and Processing Data';
  }
  return (
    <div className={styles.statusContainer}>
      <Alert variant="outlined" severity="error">
        <AlertTitle>{message}</AlertTitle>
        Please try reloading the page
      </Alert>
    </div>
  );
};

const LandingPage = (props) => {
  const { mainDataModel } = props;
  const statusMainDataModel = useSelector(selectStatusMainDataModel);
  if (
    statusMainDataModel === ENV.STATUS_IDLE ||
    statusMainDataModel === ENV.STATUS_WAITING
  ) {
    return <Loading />;
  } else if (statusMainDataModel === ENV.STATUS_ERROR) {
    return <Error />;
  } else if (mainDataModel == null) {
    return <Error type={'unknown'} />;
  }
  let cameras = [];
  let incidents = [];
  mainDataModel.forEach((cameraObj) => {
    cameras.push({
      title: cameraObj.title,
      url: cameraObj.url,
      cameraIndex: cameraObj.cameraIndex,
    });
    cameraObj.incidents.forEach((incident) => {
      const tempIncident = { ...incident };
      tempIncident['title'] = incident.objectIdentified;
      incidents.push(tempIncident);
    });
  });

  return (
    <div>
      <div className={styles.containerVideoStreams}>
        <div className={styles.titleVideoStreams}>Video Streams</div>
        <VideoThumbnails
          videos={cameras}
          width={ENV.VIDEO_STREAMS_WIDTH}
          height={ENV.VIDEO_STREAMS_HEIGHT}
          isThumbnail={false}
          pageLink={ENV.PAGE_LIVE_STREAM}
          videoType={ENV.VIDEO_TYPE_CAMERA}
        />
      </div>
      <div className={styles.containerRecentIncidents}>
        <div className={styles.titleRecentIncidents}>Recent Incidents</div>
        <VideoThumbnails
          videos={incidents}
          width={ENV.VIDEO_THUMBNAIL_WIDTH}
          height={ENV.VIDEO_THUMBNAIL_HEIGHT}
          isThumbnail={true}
          pageLink={ENV.PAGE_INCIDENT_VIEWER}
          videoType={ENV.VIDEO_TYPE_INCIDENT}
        />
      </div>
    </div>
  );
};

export default LandingPage;
