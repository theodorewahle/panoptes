import React from 'react';

import ReactPlayer from 'react-player';
import VideoThumbnail from 'react-video-thumbnail';

import styles from './Video.module.scss';

// import { Link } from 'react-router-dom';

const Video = (props) => {
  // TODO: redundancy
  const { width, height, title, url, isThumbnail } = props;
  // TODO: have prop be option of size in text then convert
  //       to dimensions here
  if (width == null || height == null || url == null) {
    console.error('"width", "height", & "url" params in Video cannot be null');
    return null;
  }
  let displayTitle = title;
  if (displayTitle == null) {
    displayTitle = 'No Title';
  }

  let display;
  if (isThumbnail) {
    display = (
      <VideoThumbnail
        videoUrl={url}
        width={width}
        height={height}
        thumbnailHandler={(thumbnail) => console.log(thumbnail)}
      />
    );
  } else {
    display = <ReactPlayer url={url} width={width} height={height} />;
  }
  // const isThumbnail = url.includes('.jpg');

  return (
    <div
      onClick={console.log('TODO: click')}
      className={styles.video}
      style={{ width, height }}
    >
      {display}
      <div className={styles.title}>{displayTitle}</div>
    </div>
  );
};

export default Video;

// return (
//   <Link to="/cameras/alpha_chi_parking_lot">
//     <div
//       onClick={console.log('click')}
//       className={styles.video}
//       style={{ width, height }}
//     >
//       {isThumbnail === false && (
//         <ReactPlayer url={url} width={width} height={height} />
//       )}
//       {isThumbnail === true && (
//         <img src={url} alt="" width={width} height={height} />
//       )}
//       <div className={styles.title}>{displayTitle}</div>
//     </div>
//   </Link>
// );
