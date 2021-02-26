import React from 'react';
import VideoThumbnails from '../../video/VideoThumbnails';
import { initRecentIncidents } from '../../video/data';
import styles from './IncidentViewerPage.module.scss';
import ENV from '../../../env';
import Video from '../../video/Video';

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

// TODO: merge with LiveStreamPage as CSS will be similar
// TODO: wire up with redux
const IncidentViewerPage = () => {
  // placeholder data
  const videos = initRecentIncidents;
  const video = videos[0];
  const data = {
    time: '11:01am',
    location: 'kitchen',
    objectsIdentified: 'baby, birthday cake, knife, frying pan',
  };
  return (
    <div className={styles.container}>
      <div className={styles.incidentContainer}>
        <div className={styles.incidentContainerText}>
          <div className={styles.title}>Incident</div>
          <div className={styles.info}>
            <DataRow title={'Time'} data={data.time} />
            <DataRow title={'Location'} data={data.location} />
            <DataRow
              title={'Objects Identified'}
              data={data.objectsIdentified}
            />
          </div>
        </div>
        <div className={styles.video}>
          <Video
            video={video}
            width={ENV.VIDEO_MAIN_WIDTH}
            height={ENV.VIDEO_MAIN_HEIGHT}
          />
        </div>
      </div>
      <div className={styles.incidentsBottom}>
        <VideoThumbnails
          videos={videos}
          width={ENV.VIDEO_THUMBNAIL_WIDTH}
          height={ENV.VIDEO_THUMBNAIL_HEIGHT}
        />
      </div>
    </div>
  );
};

export default IncidentViewerPage;
