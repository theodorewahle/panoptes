/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainDataModel, setMainDataModel } from '../../video/videoSlice';
import { tempDataMainDataModel } from '../../video/data';
import VideoThumbnails from '../../video/VideoThumbnails';
import styles from './LandingPage.module.scss';
import ENV from '../../../env';

const LandingPage = () => {
  const dispatch = useDispatch();
  const mainDataModel = useSelector(selectMainDataModel);
  useEffect(() => {
    dispatch(setMainDataModel(tempDataMainDataModel));
  });
  if (mainDataModel == null) {
    console.log('TODO: display nice loading wheel');
    return <div>Loading...</div>;
  }
  let cameras = [];
  let incidents = []; // TODO: splice together most recent incidents from all cameras
  let cameraIndex = -1;
  mainDataModel.forEach((cameraObj) => {
    cameraIndex++;
    cameras.push({ title: cameraObj.title, url: cameraObj.url });
    cameraObj.incidents.forEach((incident) => {
      console.log(JSON.stringify(incident));
      const thumbnail = {
        title: incident.startTime,
        url: incident.url,
        startTime: incident.startTime,
        endTime: incident.endTime,
        objectsIdentified: incident.objectsIdentified,
        cameraIndex,
      };
      incidents.push(thumbnail);
    });
  });

  // TODO: pass camera index to VideoThumbnails for VIDEO_TYPE_INCIDENT
  //       (this is currently hardcoded in videoSlice.video.curCameraIndex)
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
