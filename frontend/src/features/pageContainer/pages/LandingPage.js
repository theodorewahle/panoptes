import React from 'react';
// import { useSelector } from 'react-redux';
// import { selectStreams, selectRecentIncidents } from '../../video/videoSlice';
import VideoThumbnails from '../../video/VideoThumbnails';
import styles from './LandingPage.module.scss';
import ENV from '../../../env';

const LandingPage = (props) => {
  const { mainDataModel } = props;
  // const streams = useSelector(selectStreams);
  // const recentIncidents = useSelector(selectRecentIncidents);
  if (mainDataModel == null) {
    console.log('TODO: display nice loading wheel');
    return <div>Loading...</div>;
  }
  let cameras = [];
  let incidents = []; // TODO: splice together most recent incidents from all cameras
  mainDataModel.forEach((cameraObj) => {
    cameras.push({ title: cameraObj.title, url: cameraObj.url });
    cameraObj.incidents.forEach((incident) => {
      incidents.push(incident);
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
        />
      </div>
      <div className={styles.containerRecentIncidents}>
        <div className={styles.titleRecentIncidents}>Recent Incidents</div>
        <VideoThumbnails
          videos={incidents}
          width={ENV.VIDEO_THUMBNAIL_WIDTH}
          height={ENV.VIDEO_THUMBNAIL_HEIGHT}
          isThumbnail={true}
        />
      </div>
    </div>
  );
};

export default LandingPage;
