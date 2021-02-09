import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openSocket, closeSocket, selectPage } from './pageContainerSlice';
import Video from '../video/Video';
import { TextField, Button } from '@material-ui/core';
import ENV from '../../env';
import styles from './PageContainer.module.scss';

const PageHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerText}>Panoptes</div>
        <form>
          <div className={styles.searchBar}>
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              value="test"
              fullWidth={true}
              onChange={(e) => console.log(e)}
            />
            <Button
              type="submit"
              variant="outlined"
              size="large"
              disabled={true} // TODO
              // fullWidth={true}
            >
              Search
            </Button>
          </div>
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
    return () => {
      dispatch(closeSocket());
    };
  });
  let display = null;
  // TODO holding off linking up to router incase server-side rendering changes this
  if (page === ENV.PAGE_LANDING) {
    display = null;
  } else if (page === ENV.PAGE_SEARCH_RESULTS) {
    display = null;
  } else if (page === ENV.PAGE_SEARCH_RESULTS_NONE) {
    display = null;
  } else if (page === ENV.PAGE_INCIDENT_VIEWER) {
    display = null;
  } else if (page === ENV.PAGE_LIVE_STREAM) {
    display = null;
  } else if (page === ENV.PAGE_LIVE_STREAM) {
    display = null;
  } else if (page === ENV.PAGE_OBJECT_SET) {
    display = null;
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
