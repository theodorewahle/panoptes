import React from 'react';
import { useSelector } from 'react-redux';
import VideoThumbnails from '../../../video/VideoThumbnails';
import { selectSearchCurrent } from '../../pageContainerSlice';
import { selectSearchResults } from '../../../video/videoSlice';
import styles from './SearchResultsPage.module.scss';
import ENV from '../../../../env';

const SearchResultsPage = () => {
  const searchCurrent = useSelector(selectSearchCurrent);
  const searchResults = useSelector(selectSearchResults);
  let resultsMessage = '';
  let results = '';
  // Cases:
  //  (1) No results - object NOT in set
  //  (2) No results - object in set
  //  (3) Results of search

  // (1) & (2)
  if (searchResults == null || searchResults.length === 0) {
    resultsMessage = `No results for "${searchCurrent}"`;
    // TODO: differentiate cases 1 & 2
    results = `"TODO: ${searchCurrent}" is in a set or not in a set and this should link to that`;
  }
  // (3)
  else {
    resultsMessage = `Showing results for "${searchCurrent}"`;
    results = (
      <VideoThumbnails
        videos={searchResults}
        width={ENV.VIDEO_THUMBNAIL_WIDTH}
        height={ENV.VIDEO_THUMBNAIL_HEIGHT}
      />
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.resultsMessage}>{resultsMessage}</div>
      <div className={styles.results}>{results}</div>
    </div>
  );
};

export default SearchResultsPage;
