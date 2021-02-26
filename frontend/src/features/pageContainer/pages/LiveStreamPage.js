/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectRecentIncidents,
  selectCurIncidentIndex,
} from '../../video/videoSlice';

import VideoThumbnails from '../../video/VideoThumbnails';
import ReactPlayer from 'react-player';

import ENV from '../../../env';
import styles from './LiveStreamPage.module.scss';

const LiveStreamPage = () => {
  const recentIncidents = useSelector(selectRecentIncidents);
  const curIncidentIndex = useSelector(selectCurIncidentIndex);
  // TODO: display objects being tracked (currently no link to cameras in backend)
  // TODO: add object set button/form/modal
  return (
    <div>
      <div className={styles.containerLiveStream}>
        <div className={styles.containerStreamData}>
          <h1>Alpha Chi Alpha — Parking Lot</h1>
          <h2>Now Playing: {recentIncidents[curIncidentIndex].title}</h2>
          <h3>Recent Incidents: {recentIncidents.length}</h3>
          <button onClick={console.log('TODO: reset')}>
            Return to Live Feed
          </button>
        </div>
        <div>
          <ReactPlayer
            url={recentIncidents[curIncidentIndex].url}
            width={720}
            height={405}
            playing
          />
        </div>
      </div>

      <div className={styles.containerRecentIncidents}>
        <div className={styles.titleRecentIncidents}>Recent Incidents</div>
        <VideoThumbnails
          videos={recentIncidents}
          width={ENV.VIDEO_THUMBNAIL_WIDTH}
          height={ENV.VIDEO_THUMBNAIL_HEIGHT}
        />
      </div>
    </div>
  );
};

export default LiveStreamPage;
