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
import { Button } from '@material-ui/core';

import ENV from '../../../env';
import styles from './LiveStreamPage.module.scss';

const DataRow = (props) => {
  const { title, data } = props;
  if (title == null || data == null) return null;
  return (
    <div className={styles.incidentRow}>
      <div className={styles.rowTitle}>{title}</div>
      <div className={styles.rowData}>{data}</div>
    </div>
  );
};

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
    // CSS: move RETURN TO LIVE FEED button to bottom of container
    display = (
      <div>
        <h1>Incident</h1>
        <DataRow title={'Start Time'} data={curIncident.startTime} />
        <DataRow title={'End Time'} data={curIncident.endTime} />
        <DataRow
          title={'Object Identified'}
          data={curIncident.objectIdentified}
        />
        <div className={styles.button}>
          <Button onClick={() => dispatch(setPage(ENV.PAGE_LIVE_STREAM))}>
            Return to Live Feed
          </Button>
        </div>
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
