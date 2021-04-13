import React from 'react';
import ExpandableVideoRow from './ExpandableVideoRow';
import styles from './Video.module.scss';

const VideoGroup = (props) => {
  const { videos } = props;

  let resultsByVideo = {};
  if (videos !== null && videos.length > 1) {
    videos.forEach((result) => {
      // console.log('res', result)

      const incidentId = result.url + '_' + result.objectIdentified;
      if (!(incidentId in resultsByVideo)) {
        resultsByVideo[incidentId] = [];
      }
      resultsByVideo[incidentId].push(result);
    });
  }

  const thumbnails = Object.keys(resultsByVideo).map((groupId) => {
    const results = resultsByVideo[groupId];
    const objectIdentified = groupId.split('_')[1];
    // console.log(groupId)
    // console.log('Obj', objectIdentified)

    return (
      <div className={styles.column}>
        <ExpandableVideoRow
          videos={results}
          objectIdentified={objectIdentified}
        />
      </div>
    );
  });

  return <div className={styles.videoThumbnails}>{thumbnails}</div>;
};

export default VideoGroup;
