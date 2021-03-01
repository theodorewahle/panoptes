import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurIncidentIndex,
  // selectMainDataModel,
  selectCurCameraIndex,
} from '../../../video/videoSlice';
import { setPage, selectPage } from '../../pageContainerSlice';

import VideoThumbnails from '../../../video/VideoThumbnails';
import ReactPlayer from 'react-player';
import { Button } from '@material-ui/core';

import ENV from '../../../../env';
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

const LiveStreamPage = (props) => {
  const dispatch = useDispatch();
  const { mainDataModel } = props;
  // const mainDataModel = useSelector(selectMainDataModel);
  const curIncidentIndex = useSelector(selectCurIncidentIndex);
  const curCameraIndex = useSelector(selectCurCameraIndex);
  const page = useSelector(selectPage);

  console.log(`curIncidentIndex: ${curIncidentIndex}`);
  console.log(`curCameraIndex: ${curCameraIndex}`);
  console.log(`page: ${page}`);

  const curCamera = mainDataModel[curCameraIndex];
  const curIncident = curCamera.incidents[curIncidentIndex];

  let incidents = [];
  curCamera.incidents.forEach((incident) => {
    const tempIncident = { ...incident };
    tempIncident['title'] = incident.objectIdentified;
    incidents.push(tempIncident);
  });
  let display, url;
  if (page === ENV.PAGE_LIVE_STREAM) {
    url = curCamera.url;
    const recentIncidentsText = `Recent Incidents: ${incidents.length}`;
    display = (
      <div>
        <h1>Live Stream: {curCamera.title}</h1>
        <h3>
          {incidents.length === 0 ? 'No Recent Incidents' : recentIncidentsText}
        </h3>
      </div>
    );
  } else if (page === ENV.PAGE_INCIDENT_VIEWER) {
    url = curIncident.url;
    display = (
      <div className={styles.leftPanel}>
        <div>
          <h1>Incident</h1>
          <DataRow title={'Start Time'} data={curIncident.startTime} />
          <DataRow title={'End Time'} data={curIncident.endTime} />
          <DataRow
            title={'Object Identified'}
            data={curIncident.objectIdentified}
          />
        </div>
        <div className={styles.button}>
          <Button
            size="large"
            variant="outlined"
            onClick={() => dispatch(setPage(ENV.PAGE_LIVE_STREAM))}
          >
            View Live Feed
          </Button>
        </div>
      </div>
    );
  } else {
    console.error('pageContainerSlice.page is not wired correctly');
  }

  // TODO: display objects being tracked
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
