import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecentIncidents, setStreams } from '../video/videoSlice';
import {
  openSocket,
  closeSocket,
  selectPage,
  selectSearchInput,
  setSearchInput,
} from './pageContainerSlice';
import Video from '../video/Video';
import { TextField, Button } from '@material-ui/core';

import LandingPage from './pages/LandingPage';
import LiveStreamPage from './pages/LiveStreamPage';

import { initStreams, initRecentIncidents } from '../video/data';
import ENV from '../../env';
import styles from './PageContainer.module.scss';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

const PageHeader = () => {
  const dispatch = useDispatch();
  const searchInput = useSelector(selectSearchInput);
  console.log(`searchInput: ${searchInput}`);
  const onSearch = (e) => {
    e.preventDefault();
    console.log('TODO: processed server-side or client-side?');
    dispatch(setSearchInput('TODO'));
  };
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerText}>Panoptes</div>
        <form className={styles.searchBar} onSubmit={(e) => onSearch(e)}>
          <TextField
            id='outlined-basic'
            label="Search Today's Incidents..."
            variant='outlined'
            value={searchInput}
            fullWidth={true}
            onChange={(e) => dispatch(setSearchInput(e.target.value))}
          />
          <Button
            type='submit'
            variant='outlined'
            size='large'
            disabled={searchInput.length > 0 ? false : true} // TODO
          >
            Go
          </Button>
        </form>
      </div>
    </div>
  );
};

// This component doubles as a socketWrapper
const PageContainer = () => {
  const dispatch = useDispatch();
  const page = useSelector(selectPage);
  useEffect(() => {
    dispatch(openSocket());
    dispatch(setStreams(initStreams));
    dispatch(setRecentIncidents(initRecentIncidents));
    return () => {
      dispatch(closeSocket());
    };
  });
  
  let display = null;
  // TODO holding off linking up to router incase server-side rendering changes this
  if (page === ENV.PAGE_LANDING) {
    display = <LandingPage />;
  } else if (page === ENV.PAGE_SEARCH_RESULTS) {
    display = null;
  } else if (page === ENV.PAGE_SEARCH_RESULTS_NONE) {
    display = null;
  } else if (page === ENV.PAGE_INCIDENT_VIEWER) {
    display = null;
  } else if (page === ENV.PAGE_LIVE_STREAM) {
    display = null;
  } else if (page === ENV.PAGE_OBJECT_SET) {
    display = null;
  }
  console.log(display)

  return (
    <div className={styles.PageContainer}>
      <PageHeader />
      <Video />
      
      <Router>
      <div>
        <Switch>
          <Route path='/cameras/alpha_chi_parking_lot'>
            <LiveStreamPage />
          </Route>
          <Route path='/'>
            <LandingPage />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
};

export default PageContainer;
