/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectMainDataModel,
  setStatusCameras,
  selectStatusCameras,
} from '../../video/videoSlice';
import { addUpdateCamera } from '../../../api/cameras';
import { isValidHttpUrl } from '../../../utilGeneral/utils';

import { TextField, Button, CircularProgress } from '@material-ui/core';

import styles from './EditCamerasPage.module.scss';
import ENV from '../../../env';

// TODO: CSS lol
const EditCamerasPage = () => {
  const dispatch = useDispatch();
  const [titleInput, setTitleInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [cameraId, setCameraId] = useState('');
  const [formStatus, setFormStatus] = useState(ENV.FORM_IDLE);
  const mainDataModel = useSelector(selectMainDataModel);
  const statusCameras = useSelector(selectStatusCameras);

  useEffect(() => {
    dispatch(setStatusCameras({ status: ENV.STATUS_IDLE }));
  }, [dispatch]);

  // TODO: put LandingPage.js error code somewhere else and use here
  if (mainDataModel == null) return null;

  const onAddUpdateCamera = (e) => {
    e.preventDefault();
    setStatusCameras({ status: ENV.STATUS_WAITING });
    addUpdateCamera({ formStatus, titleInput, urlInput, cameraId });
    setTitleInput('');
    setUrlInput('');
    setCameraId(-1);
  };

  // TODO: display bad URL message to user if they keep clicking 'Update Camera'?
  const isSubmitCameraButtonDisabled = (title, url) => {
    if (url.length === 0 || title.length === 0) {
      return true;
    }
    if (!isValidHttpUrl(url)) {
      return true;
    }
    return false;
  };

  // TODO: add checkmark indicating successful update
  // TODO: add 'Are you sure you want to delete this camera'
  //       popup with typing name confirmation
  let key = 0;
  const camerasList = mainDataModel.map((camera) => {
    key++;
    const rowDisplay = (
      <div>
        <div>Title: {camera.title}</div>
        <div>URL: {camera.url}</div>
      </div>
    );
    return (
      <div className={styles.cameraRowEdit} key={key}>
        {rowDisplay}
        <div>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              setStatusCameras({ status: ENV.STATUS_IDLE });
              setFormStatus(ENV.FORM_UPDATE_CAMERA);
              setCameraId(camera.camera_id);
              setTitleInput(camera.title);
              setUrlInput(camera.url);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              setStatusCameras({ status: ENV.STATUS_IDLE });
              addUpdateCamera({
                formStatus: ENV.FORM_DELETE_CAMERA,
                titleInput,
                urlInput,
                cameraId: camera.camera_id,
              });
            }}
          >
            Del
          </Button>
        </div>
      </div>
    );
  });

  let cameraButtonTitleRow = (
    <Button
      variant="outlined"
      size="large"
      onClick={() => {
        setStatusCameras({ status: ENV.STATUS_IDLE });
        setFormStatus(ENV.FORM_ADD_CAMERA);
        setTitleInput('');
        setUrlInput('');
      }}
    >
      Add New Camera
    </Button>
  );

  // TODO: this logic could be cleaned up and made more readable
  let form, apiStatus;
  if (formStatus === ENV.FORM_IDLE) {
    form = null;
  } else {
    let formButtonText = '';
    if (formStatus === ENV.FORM_ADD_CAMERA) {
      formButtonText = 'Add Camera';
      cameraButtonTitleRow = null;
    } else if (formStatus === ENV.FORM_UPDATE_CAMERA) {
      formButtonText = 'Update Camera';
    }
    form = (
      <form className={styles.searchBar} onSubmit={(e) => onAddUpdateCamera(e)}>
        <TextField
          id="outlined-basic"
          label="Camera Title"
          variant="outlined"
          value={titleInput}
          fullWidth={true}
          onChange={(e) => setTitleInput(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="URL"
          variant="outlined"
          value={urlInput}
          fullWidth={true}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <Button
          type="submit"
          variant="outlined"
          size="large"
          disabled={isSubmitCameraButtonDisabled(titleInput, urlInput)}
        >
          {formButtonText}
        </Button>
      </form>
    );
  }

  if (statusCameras.status === ENV.STATUS_IDLE) {
    apiStatus = null;
  } else if (statusCameras.status === ENV.STATUS_WAITING) {
    apiStatus = <CircularProgress />;
  } else if (statusCameras.status === ENV.STATUS_ERROR) {
    apiStatus = <div>{statusCameras.message}</div>;
  } else if (statusCameras.status === ENV.STATUS_DONE) {
    // TOOD: display checkmark
    apiStatus = null;
    form = null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.cameraTitleRow}>
        <h1>Cameras</h1>
        {cameraButtonTitleRow}
      </div>
      {camerasList}
      {form}
      {apiStatus}
    </div>
  );
};

export default EditCamerasPage;
