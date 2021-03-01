import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPage,
  selectSearchInput,
  setSearchInput,
  setSearchCurrent,
  setPage,
} from './pageContainerSlice';
import { fetchAndProcessDataModel } from '../../api/processData';

import Video from '../video/Video';
import { TextField, Button } from '@material-ui/core';

import LandingPage from './pages/landingPage/LandingPage';
import LiveStreamPage from './pages/liveStreamPage/LiveStreamPage';

import ENV from '../../env';
import styles from './PageContainer.module.scss';
import EditCamerasPage from './pages/editCamerasPage/EditCamerasPage';

// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const PageHeader = () => {
  const dispatch = useDispatch();
  const searchInput = useSelector(selectSearchInput);
  const page = useSelector(selectPage);
  console.log(`searchInput: ${searchInput}`);

  let editCameraButtonText;
  if (page === ENV.PAGE_EDIT_CAMERAS) {
    editCameraButtonText = 'View Streams';
  } else {
    editCameraButtonText = 'Edit Cameras';
  }

  const onSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchCurrent(searchInput));
    dispatch(setPage(ENV.PAGE_SEARCH_RESULTS));
    dispatch(setSearchInput(''));
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
  useEffect(() => {
    // dispatch(openSocket());
    fetchAndProcessDataModel();
    return () => {
      // dispatch(closeSocket());
    };
  }, []);

  let display = null;
  // TODO holding off linking up to router incase server-side rendering changes this
  if (page === ENV.PAGE_LANDING) {
    display = <LandingPage />;
  } else if (page === ENV.PAGE_SEARCH_RESULTS) {
    display = null;
  } else if (page === ENV.PAGE_SEARCH_RESULTS_NONE) {
    display = null;
  } else if (
    page === ENV.PAGE_INCIDENT_VIEWER ||
    page === ENV.PAGE_LIVE_STREAM
  ) {
    display = <LiveStreamPage />;
  } else if (page === ENV.PAGE_OBJECT_SET) {
    display = null;
  } else if (page === ENV.PAGE_EDIT_CAMERAS) {
    display = <EditCamerasPage />;
  }

  return (
    <div className={styles.PageContainer}>
      <PageHeader />
      <Video />
      {display}
    </div>
  );
};

export default PageContainer;

// {/* <Router>
// <div>
//   <Switch>
//     <Route path="/">
//       <LandingPage mainDataModel={mainDataModel} />
//     </Route>
//     <Route path="/cameras/alpha_chi_parking_lot">
//       <LiveStreamPage mainDataModel={mainDataModel} />
//     </Route>
//   </Switch>
// </div>
// </Router> */}
