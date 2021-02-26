/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectRecentIncidents,
  selectCurIncidentIndex,
  selectMainDataModel,
  selectCurCameraIndex,
} from '../../video/videoSlice';
import { setPage, selectPage } from '../pageContainerSlice';

import VideoThumbnails from '../../video/VideoThumbnails';
import ReactPlayer from 'react-player';

import ENV from '../../../env';
import styles from './LiveStreamPage.module.scss';

const LiveStreamPage = () => {
  const dispatch = useDispatch(setPage);
  const mainDataModel = useSelector(selectMainDataModel);
  const curIncidentIndex = useSelector(selectCurIncidentIndex);
  const curCameraIndex = useSelector(selectCurCameraIndex);
  const page = useSelector(selectPage);

  console.log(`curIncidentIndex: ${curIncidentIndex}`);
  console.log(`curCameraIndex: ${curCameraIndex}`);
  console.log(`page: ${page}`);

  const curCamera = mainDataModel[curCameraIndex];
  const curIncident = curCamera.incidents[curIncidentIndex];

  let incidents = [];
  // this is to add 'title'
  curCamera.incidents.forEach((incident) => {
    incidents.push({
      title: incident.startTime,
      url: incident.url,
      startTime: incident.startTime,
      endTime: incident.endTime,
      objectsIdentified: incident.objectsIdentified,
    });
  });
  let display, url;
  if (page === ENV.PAGE_LIVE_STREAM) {
    url = curCamera.url;
    display = (
      <div>
        <h1>Live Stream: {curCamera.title}</h1>
        <h3>Recent Incidents: {incidents.length}</h3>
      </div>
    );
  } else if (page === ENV.PAGE_INCIDENT_VIEWER) {
    url = curIncident.url;
    // TODO: port IncidentViewPage code over here
    display = (
      <div>
        <h1>Incident</h1>
        <h3>Start Time: {curIncident.startTime}</h3>
        <h3>End Time: {curIncident.startTime}</h3>
        <h3>Start Time: {curIncident.endTime}</h3>
        <h3>Object Identified: {curIncident.objectIdentified}</h3>
        <button onClick={() => dispatch(setPage(ENV.PAGE_LIVE_STREAM))}>
          Return to Live Feed
        </button>
      </div>
    );
  } else {
    console.error('pageContainerSlice.page is not wired correctly');
  }

  // TODO: display objects being tracked (currently no link to cameras in backend)
  // TODO: add object set button/form/modal
  return (
    <div>
      <div className={styles.containerLiveStream}>
        <div className={styles.containerStreamData}>{display}</div>
        <div>
          <ReactPlayer url={url} width={720} height={405} playing />
        </div>
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

export default LiveStreamPage;
