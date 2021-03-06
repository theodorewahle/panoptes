/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectMainDataModel,
  selectSearchResults,
  selectStatusSearch,
  selectSearchFilter,
  setSearchFilter,
} from '../../../video/videoSlice';
import { selectSearchCurrent } from '../../pageContainerSlice';
import { processSearch } from './processSearch';

import {
  Button,
  CircularProgress,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import VideoThumbnails from '../../../video/VideoThumbnails';

import styles from './SearchResultsPage.module.scss';
import ENV from '../../../../env';

const getFilters = ({
  searchFilter,
  mainDataModel,
  searchCurrent,
  dispatch,
}) => {
  const tempFilterArr = [];
  Object.keys(searchFilter).forEach((filter) => {
    tempFilterArr.push({ name: filter, value: searchFilter[filter] });
  });
  let key = 0;
  return tempFilterArr.map((filter) => {
    key++;
    return (
      <FormControlLabel
        key={key}
        control={
          <Checkbox
            checked={filter.value}
            onChange={(e) => {
              dispatch(
                setSearchFilter({
                  name: e.target.name,
                  value: e.target.checked,
                })
              );
              let filter = { ...searchFilter };
              filter[e.target.name] = e.target.checked;
              processSearch({
                mainDataModel,
                searchCurrent,
                searchFilter: filter,
              });
            }}
            name={filter.name}
          />
        }
        label={filter.name}
      />
    );
  });
};

const SearchResultsPage = () => {
  const dispatch = useDispatch();
  const [sortByMostRecent, setSortByMostRecent] = useState(true);
  const mainDataModel = useSelector(selectMainDataModel);
  const searchResults = useSelector(selectSearchResults);
  const statusSearch = useSelector(selectStatusSearch);
  const searchFilter = useSelector(selectSearchFilter);
  const searchCurrent = useSelector(selectSearchCurrent);
  const { status, message } = statusSearch;

  console.log(`sortByMostRecent: ${sortByMostRecent}`);
  let sortedSearchResults = [...searchResults];
  sortedSearchResults.sort((a, b) => {
    try {
      if (sortByMostRecent) {
        return new Date(a.timeStamp) - new Date(b.timeStamp);
      }
      return -1 * (new Date(a.timeStamp) - new Date(b.timeStamp));
    } catch {
      return 0;
    }
  });

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
  } else if (status === ENV.STATUS_DONE && sortedSearchResults != null) {
    display = (
      <VideoThumbnails
        videos={sortedSearchResults}
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
  const filters = getFilters({
    searchFilter,
    mainDataModel,
    searchCurrent,
    dispatch,
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
        <div className={styles.filters}>
          <div className={styles.filterForm}>{filterForm}</div>
          <div className={styles.sortButton}>
            <Button
              onClick={() => setSortByMostRecent(!sortByMostRecent)}
              color="inherit"
              startIcon={
                sortByMostRecent ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />
              }
            >
              Sort by Date
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.resultsContainer}>{display}</div>
    </div>
  );
};

export default SearchResultsPage;
