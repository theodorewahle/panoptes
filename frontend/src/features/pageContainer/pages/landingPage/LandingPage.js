import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectMainDataModel,
  selectStatusMainDataModel,
} from '../../../video/videoSlice';

import VideoThumbnails from '../../../video/VideoThumbnails';
import { CircularProgress } from '@material-ui/core';

import styles from './LandingPage.module.scss';
import ENV from '../../../../env';

// TODO: CSS
const Loading = () => {
  return <CircularProgress />;
};

// TODO: CSS
const Error = (props) => {
  const { type } = props;
  let message;
  if (type != null && type === 'unknown') {
    message = 'Unknown error fetching and processing data';
  } else {
    message = 'Error Fetching and Processing Data';
  }
  return (
    <div>
      <div>TODO: CSS</div>
      <div>{message}</div>
    </div>
  );
};

const LandingPage = () => {
  const statusMainDataModel = useSelector(selectStatusMainDataModel);
  const mainDataModel = useSelector(selectMainDataModel);
  console.log(`statusMainDataModel: ${statusMainDataModel}`);
  if (
    statusMainDataModel === ENV.STATUS_IDLE ||
    statusMainDataModel === ENV.STATUS_WAITING
  ) {
    console.log('TODO: display nice loading wheel');
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
      console.log(JSON.stringify(incident));
      const thumbnail = {
        title: incident.startTime,
        url: incident.url,
        startTime: incident.startTime,
        endTime: incident.endTime,
        objectsIdentified: incident.objectsIdentified,
        cameraIndex: cameraObj.cameraIndex,
        incidentIndex: incident.incidentIndex,
      };
      incidents.push(thumbnail);
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
          isThumbnail={false}
          pageLink={ENV.PAGE_INCIDENT_VIEWER}
          videoType={ENV.VIDEO_TYPE_INCIDENT}
        />
      </div>
    </div>
  );
};

export default LandingPage;
