import React from 'react';
import { useDispatch } from 'react-redux';
import { setPage } from '../pageContainer/pageContainerSlice';
import { setCurCameraIndex, setCurIncidentIndex } from './videoSlice';

import ReactPlayer from 'react-player';
import VideoThumbnail from 'react-video-thumbnail';

import ENV from '../../env';
import styles from './Video.module.scss';

// import { Link } from 'react-router-dom';

const Video = (props) => {
  const dispatch = useDispatch();
  // TODO: pageLink can be removed with logic
  const {
    width,
    height,
    title,
    url,
    isThumbnail,
    index,
    videoType,
    pageLink,
    cameraIndex,
  } = props;
  // TODO: have prop be option of size in text then convert
  //       to dimensions here
  if (width == null || height == null || url == null) {
    // console.error('"width", "height", & "url" params in Video cannot be null');
    return null;
  }
  let displayTitle = title;
  if (displayTitle == null) {
    displayTitle = 'No Title';
  }

  const onSelect = () => {
    console.log(`title: ${title}, isThumbnail: ${isThumbnail}`);
    console.log(`index: ${index}, videoType: ${videoType}, url: ${url}`);
    console.log(`cameraIndex: ${cameraIndex}, pageLink: ${pageLink}`);
    if (videoType === ENV.VIDEO_TYPE_CAMERA) {
      dispatch(setCurCameraIndex(index));
    } else if (videoType === ENV.VIDEO_TYPE_INCIDENT) {
      if (cameraIndex !== -1) dispatch(setCurCameraIndex(cameraIndex));
      dispatch(setCurIncidentIndex(index));
    }
    if (pageLink !== ENV.PAGE_NO_LINK) {
      dispatch(setPage(pageLink));
    }
  };

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
      onClick={() => onSelect()}
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
