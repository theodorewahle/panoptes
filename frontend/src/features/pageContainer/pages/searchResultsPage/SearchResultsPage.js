/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectMainDataModel,
  selectSearchResults,
  selectStatusSearch,
  selectSearchFilterCameras,
  setSearchFilterCameras,
  selectSearchFilterObjects,
  setSearchFilterObjects,
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

const getCameraFilters = ({
  searchFilterCameras,
  searchFilterObjects,
  mainDataModel,
  searchCurrent,
  dispatch,
}) => {
  const tempFilterArr = [];
  Object.keys(searchFilterCameras).forEach((filter) => {
    tempFilterArr.push({ name: filter, value: searchFilterCameras[filter] });
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
                setSearchFilterCameras({
                  name: e.target.name,
                  value: e.target.checked,
                })
              );
              let filter = { ...searchFilterCameras };
              filter[e.target.name] = e.target.checked;
              processSearch({
                mainDataModel,
                searchCurrent,
                searchFilterObjects,
                searchFilterCameras: filter,
                isNewSearch: false,
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

const getObjectFilters = ({
  searchFilterCameras,
  searchFilterObjects,
  mainDataModel,
  searchCurrent,
  dispatch,
}) => {
  const tempFilterArr = [];
  Object.keys(searchFilterObjects).forEach((filter) => {
    if (filter != null && searchFilterObjects[filter] != null) {
      tempFilterArr.push({ name: filter, value: searchFilterObjects[filter] });
    }
  });
  let key = -1;
  return tempFilterArr.map((filter) => {
    key--;
    return (
      <FormControlLabel
        key={key}
        control={
          <Checkbox
            checked={filter.value}
            onChange={(e) => {
              dispatch(
                setSearchFilterObjects({
                  name: e.target.name,
                  value: e.target.checked,
                })
              );
              let filter = { ...searchFilterObjects };
              filter[e.target.name] = e.target.checked;
              processSearch({
                mainDataModel,
                searchCurrent,
                searchFilterCameras,
                searchFilterObjects: filter,
                isNewSearch: false,
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
  const searchFilterCameras = useSelector(selectSearchFilterCameras);
  const searchFilterObjects = useSelector(selectSearchFilterObjects);
  const searchCurrent = useSelector(selectSearchCurrent);
  const { status, message } = statusSearch;
  console.log(`searchFilterObjects: ${JSON.stringify(searchFilterObjects)}`);

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
  const filtersObjects = getObjectFilters({
    searchFilterObjects,
    searchFilterCameras,
    mainDataModel,
    searchCurrent,
    dispatch,
  });
  const filterFormObjects = (
    <FormControl component="fieldset">
      <FormLabel component="legend">Filter by Objects</FormLabel>
      <FormGroup>{filtersObjects}</FormGroup>
    </FormControl>
  );

  const filtersCameras = getCameraFilters({
    searchFilterCameras,
    searchFilterObjects,
    mainDataModel,
    searchCurrent,
    dispatch,
  });
  const filterFormCameras = (
    <FormControl component="fieldset">
      <FormLabel component="legend">Filter by Camera</FormLabel>
      <FormGroup>{filtersCameras}</FormGroup>
    </FormControl>
  );

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.resultsMessage}>{message}</div>
        <div className={styles.filters}>
          <div className={styles.filterForm}>{filterFormObjects}</div>
          <div className={styles.filterForm}>
            {filterFormCameras}
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
      </div>
      <div className={styles.resultsContainer}>{display}</div>
    </div>
  );
};

export default SearchResultsPage;
