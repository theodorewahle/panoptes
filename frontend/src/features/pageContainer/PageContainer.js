import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openSocket, closeSocket } from './pageContainerSlice';
import Video from '../video/Video';
import { TextField, Button } from '@material-ui/core';
import styles from './PageContainer.module.scss';

// This component doubles as a socketWrapper
const PageContainer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(openSocket());
    return () => {
      dispatch(closeSocket());
    };
  });
  return (
    <div className={styles.PageContainer}>
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
      <Video />
    </div>
  );
};

export default PageContainer;
