/* eslint-disable one-var */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurIncidentIndex,
  selectCurCameraIndex,
  selectSearchAllObjects,
  selectSearchFilterCameras,
  setStatusSearch,
  // setSearchFilterCameras,
} from '../../../video/videoSlice';
import {
  setPage,
  selectPage,
  setSearchCurrent,
} from '../../pageContainerSlice';
import { processSearch } from '../searchResultsPage/processSearch';

import VideoThumbnails from '../../../video/VideoThumbnails';
import ReactPlayer from 'react-player';
import { Button, CircularProgress } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import FilterListIcon from '@material-ui/icons/FilterList';

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
  const [isErrorLoadingStream, setIsErrorLoadingStream] = useState(false);
  const [isReadyLoadingStream, setIsReadyLoadingStream] = useState(false);
  const { mainDataModel } = props;
  const curIncidentIndex = useSelector(selectCurIncidentIndex);
  const curCameraIndex = useSelector(selectCurCameraIndex);
  const searchFilterCameras = useSelector(selectSearchFilterCameras);
  const searchAllObjects = useSelector(selectSearchAllObjects);
  const page = useSelector(selectPage);

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
        <h1>Live Stream</h1>
        <h2>{curCamera.title}</h2>
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
          <DataRow title={'Time Stamp'} data={curIncident.timeStamp} />
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
            onClick={() => {
              dispatch(setPage(ENV.PAGE_LIVE_STREAM));
              setIsReadyLoadingStream(false);
              setIsErrorLoadingStream(false);
            }}
          >
            View Live Feed
          </Button>
        </div>
      </div>
    );
  } else {
    console.error('pageContainerSlice.page is not wired correctly');
  }

  const errorLoadingStream = (
    <Alert variant="outlined" severity="error">
      <AlertTitle>Error Loading Stream</AlertTitle>
      Try confirming the camera URL and reload the page.
    </Alert>
  );
  let loadingStream;
  if (isReadyLoadingStream || isErrorLoadingStream) {
    loadingStream = null;
  } else if (!isErrorLoadingStream && !isReadyLoadingStream) {
    loadingStream = (
      <div style={{ paddingLeft: 80, paddingTop: 50 }}>
        <CircularProgress color={'inherit'} size={100} />
      </div>
    );
  }

  // TODO: display objects being tracked
  // TODO: add object set button/form/modal
  return (
    <div className={styles.container}>
      <div className={styles.containerLiveStream}>
        <div className={styles.containerStreamData}>
          {display}
          {loadingStream}
        </div>
        <div>
          {isErrorLoadingStream ? errorLoadingStream : null}
          <ReactPlayer
            url={url}
            width={720}
            height={405}
            playing
            loop={true}
            onReady={() => {
              console.log('ReactPlayer onReady');
              setIsReadyLoadingStream(true);
              setIsErrorLoadingStream(false);
            }}
            onError={() => {
              console.log('ReactPlayer onError');
              setIsErrorLoadingStream(true);
              setIsReadyLoadingStream(false);
            }}
          />
        </div>
      </div>

      <div className={styles.containerRecentIncidents}>
        <div className={styles.recentIncidentsRow}>
          <div className={styles.titleRecentIncidents}>
            <b>Recent Incidents for Camera:</b> {curCamera.title}
          </div>
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => {
              // TODO: set camera filter to current page
              dispatch(setSearchCurrent(searchAllObjects));
              dispatch(setStatusSearch(ENV.STATUS_WAITING));
              dispatch(setPage(ENV.PAGE_SEARCH_RESULTS));
              processSearch({
                mainDataModel,
                searchCurrent: searchAllObjects,
                searchFilterCameras,
                searchFilterObjects: {},
                isNewSearch: true,
              });
            }}
          >
            Filter All Incidents
          </Button>
        </div>
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

export default LiveStreamPage;
