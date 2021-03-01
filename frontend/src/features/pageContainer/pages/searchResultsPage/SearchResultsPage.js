import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectSearchResults,
  selectStatusSearch,
} from '../../../video/videoSlice';

import { CircularProgress } from '@material-ui/core';
import VideoThumbnails from '../../../video/VideoThumbnails';

import styles from './SearchResultsPage.module.scss';
import ENV from '../../../../env';

const SearchResultsPage = () => {
  // const searchCurrent = useSelector(selectSearchCurrent);
  const searchResults = useSelector(selectSearchResults);
  const statusSearch = useSelector(selectStatusSearch);
  const { status, message } = statusSearch;
  // Cases:
  //  (1) No results - object NOT in set
  //  (2) No results - object in set
  //  (3) Results of search

  // TODO: (1) & (2)
  // (3)
  // TODO: this feels a bit messy
  let display;
  if (status === ENV.STATUS_ERROR) {
    display = <div className={styles.error}>TODO: Error</div>;
  } else if (status === ENV.STATUS_WAITING) {
    display = (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    );
  } else if (status === ENV.STATUS_DONE && searchResults != null) {
    display = (
      <VideoThumbnails
        videos={searchResults}
        width={ENV.VIDEO_THUMBNAIL_WIDTH}
        height={ENV.VIDEO_THUMBNAIL_HEIGHT}
        isThumbnail={false}
        pageLink={ENV.PAGE_INCIDENT_VIEWER}
        videoType={ENV.VIDEO_TYPE_INCIDENT}
      />
    );
  } else if (status === ENV.STATUS_NO_RESULTS) {
    display = null;
  } else {
    display = (
      <div className={styles.error}>
        Internal Server Error - Please try loading the page again.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.resultsMessage}>{message}</div>
      <div className={styles.resultsContainer}>{display}</div>
    </div>
  );
};

export default SearchResultsPage;
