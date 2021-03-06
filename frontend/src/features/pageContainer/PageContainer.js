import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPage,
  selectSearchInput,
  setSearchInput,
  setSearchCurrent,
  setPage,
} from './pageContainerSlice';
import {
  selectMainDataModel,
  setStatusSearch,
  selectSearchFilter,
} from '../video/videoSlice';
import { fetchAndProcessDataModel } from '../../api/processData';
import { processSearch } from './pages/searchResultsPage/processSearch';

import { TextField, Button } from '@material-ui/core';

import EditCamerasPage from './pages/editCamerasPage/EditCamerasPage';
import LandingPage from './pages/landingPage/LandingPage';
import LiveStreamPage from './pages/liveStreamPage/LiveStreamPage';
import SearchResultsPage from './pages/searchResultsPage/SearchResultsPage';

import ENV from '../../env';
import styles from './PageContainer.module.scss';

const PageHeader = (props) => {
  const dispatch = useDispatch();
  const { mainDataModel } = props;
  const searchInput = useSelector(selectSearchInput);
  const searchFilter = useSelector(selectSearchFilter);
  const page = useSelector(selectPage);

  let editCameraButtonText;
  if (page === ENV.PAGE_EDIT_CAMERAS) {
    editCameraButtonText = 'View Streams';
  } else {
    editCameraButtonText = 'Edit Cameras';
  }

  const onSearch = (e) => {
    e.preventDefault();
    const trimmedSearch = searchInput.trim();
    dispatch(setSearchCurrent(trimmedSearch));
    dispatch(setStatusSearch(ENV.STATUS_WAITING));
    dispatch(setPage(ENV.PAGE_SEARCH_RESULTS));
    processSearch({
      mainDataModel,
      searchCurrent: trimmedSearch,
      searchFilter,
    });
  };
  const onEditCameras = () => {
    if (page === ENV.PAGE_EDIT_CAMERAS) {
      dispatch(setPage(ENV.PAGE_LANDING));
    } else {
      dispatch(setPage(ENV.PAGE_EDIT_CAMERAS));
    }
  };
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div
          className={styles.headerText}
          onClick={() => dispatch(setPage(ENV.PAGE_LANDING))}
        >
          Panoptes
        </div>
        <div className={styles.rightMenuContainer}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => onEditCameras()}
          >
            {editCameraButtonText}
          </Button>
          <form className={styles.searchBar} onSubmit={(e) => onSearch(e)}>
            <TextField
              id="outlined-basic"
              label="Search Today's Incidents..."
              variant="outlined"
              value={searchInput}
              fullWidth={true}
              onChange={(e) => dispatch(setSearchInput(e.target.value))}
            />
            <Button
              type="submit"
              variant="outlined"
              size="large"
              disabled={searchInput.length > 0 ? false : true} // TODO
            >
              Go
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const PageContainer = () => {
  const page = useSelector(selectPage);
  const mainDataModel = useSelector(selectMainDataModel);
  useEffect(() => {
    fetchAndProcessDataModel();
  }, []);

  let display = null;
  // TODO holding off linking up to router incase server-side rendering changes this
  if (page === ENV.PAGE_LANDING) {
    display = <LandingPage mainDataModel={mainDataModel} />;
  } else if (page === ENV.PAGE_SEARCH_RESULTS) {
    display = <SearchResultsPage />;
  } else if (page === ENV.PAGE_SEARCH_RESULTS_NONE) {
    display = null;
  } else if (
    page === ENV.PAGE_INCIDENT_VIEWER ||
    page === ENV.PAGE_LIVE_STREAM
  ) {
    display = <LiveStreamPage mainDataModel={mainDataModel} />;
  } else if (page === ENV.PAGE_OBJECT_SET) {
    display = null;
  } else if (page === ENV.PAGE_EDIT_CAMERAS) {
    display = <EditCamerasPage mainDataModel={mainDataModel} />;
  }

  return (
    <div className={styles.PageContainer}>
      <PageHeader mainDataModel={mainDataModel} />
      {display}
    </div>
  );
};

export default PageContainer;
