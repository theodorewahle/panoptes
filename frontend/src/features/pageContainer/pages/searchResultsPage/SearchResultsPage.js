/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectMainDataModel,
  selectSearchResults,
  selectStatusSearch,
  selectSearchFilter,
} from '../../../video/videoSlice';

import {
  CircularProgress,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Checkbox,
} from '@material-ui/core';
import VideoThumbnails from '../../../video/VideoThumbnails';

import styles from './SearchResultsPage.module.scss';
import ENV from '../../../../env';

const SearchResultsPage = () => {
  const mainDataModel = useSelector(selectMainDataModel);
  const searchResults = useSelector(selectSearchResults);
  const statusSearch = useSelector(selectStatusSearch);
  const searchFilter = useSelector(selectSearchFilter);
  const { status, message } = statusSearch;
  // Cases:
  //  (1) No results - object NOT in set
  //  (2) No results - object in set
  //  (3) Results of search

  // TODO: (1) & (2)
  // (3)
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
        isThumbnail={true}
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
  const tempFilterArr = [];
  Object.keys(searchFilter).forEach((filter) => {
    tempFilterArr.push({ name: filter, value: searchFilter[filter] });
  });
  let key = 0;
  const filters = tempFilterArr.map((filter) => {
    key++;
    return (
      <FormControlLabel
        key={key}
        control={
          <Checkbox
            checked={filter.value}
            onChange={() => console.log('TODO')}
            name={filter.name}
          />
        }
        label={filter.name}
      />
    );
  });

  const filterForm = (
    <FormControl component="fieldset">
      <FormLabel component="legend">Filter by Camera</FormLabel>
      <FormGroup>{filters}</FormGroup>
    </FormControl>
  );

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.resultsMessage}>{message}</div>
        <div className={styles.filterForm}>{filterForm}</div>
      </div>
      <div className={styles.resultsContainer}>{display}</div>
    </div>
  );
};

export default SearchResultsPage;
