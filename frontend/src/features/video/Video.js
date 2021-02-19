import React from 'react';
import ReactPlayer from 'react-player';
import styles from './Video.module.scss';

import {
  Link
} from 'react-router-dom';

const Video = (props) => {
  const { width, height, title, url } = props;
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

  const isThumbnail = url.includes('.jpg')

  return (
    <Link to='/cameras/alpha_chi_parking_lot'>
    <div className={styles.video} style={{ width, height }} onClick={() => console.log('yo')}>
      {isThumbnail === false && (
        <ReactPlayer url={url} width={width} height={height} />
      )}
      {isThumbnail === true && (
      <img src={url} width={width} height={height}/>
      )}
        <div className={styles.title}>{displayTitle}</div>
    </div>
    </Link>
  );
};

export default Video;
