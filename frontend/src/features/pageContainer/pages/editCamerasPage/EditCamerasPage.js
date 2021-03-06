import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setStatusCameras,
  selectStatusCameras,
} from '../../../video/videoSlice';
import { addUpdateCamera } from '../../../../api/cameras';
import { isValidHttpUrl } from '../../../../utilGeneral/utils';

import { TextField, Button, CircularProgress, Link } from '@material-ui/core';

import styles from './EditCamerasPage.module.scss';
import ENV from '../../../../env';

// TODO: form should not go away if camera already exists
//      (no point in pinging API before checking UI data model)
const EditCamerasPage = (props) => {
  const dispatch = useDispatch();
  const { mainDataModel } = props;
  const [titleInput, setTitleInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [cameraId, setCameraId] = useState('');
  const [formStatus, setFormStatus] = useState(ENV.FORM_IDLE);
  const statusCameras = useSelector(selectStatusCameras);
  console.log(`formStatus: ${formStatus}`);
  console.log(`statusCameras.status: ${statusCameras.status}`);

  useEffect(() => {
    dispatch(setStatusCameras({ status: ENV.STATUS_IDLE }));
  }, [dispatch]);

  // TODO: put LandingPage.js error code somewhere else and use here
  if (mainDataModel == null) return null;

  const onAddUpdateCamera = (e) => {
    e.preventDefault();
    dispatch(setStatusCameras({ status: ENV.STATUS_WAITING, message: '' }));
    setFormStatus(ENV.FORM_IDLE);
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
        <Link href={camera.url}>
          {camera.title}
        </Link>
      </div>
    );
    return (
      <div className={styles.cameraRowEdit} key={key}>
        {rowDisplay}
        <div>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            className={styles.button}
            onClick={() => {
              dispatch(
                setStatusCameras({ status: ENV.STATUS_IDLE, message: '' })
              );
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
            size="small"
            color="primary"
            className={styles.button}
            onClick={() => {
              dispatch(
                setStatusCameras({ status: ENV.STATUS_IDLE, message: '' })
              );
              setFormStatus(ENV.FORM_IDLE);
              addUpdateCamera({
                formStatus: ENV.FORM_DELETE_CAMERA,
                titleInput,
                urlInput,
                cameraId: camera.camera_id,
              });
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  });

  let cameraButtonTitleRow = (
    <Button
      variant="outlined"
      size="small"
      color="primary"
      className={styles.button}
      onClick={() => {
        dispatch(setStatusCameras({ status: ENV.STATUS_IDLE }));
        setFormStatus(ENV.FORM_ADD_CAMERA);
        setTitleInput('');
        setUrlInput('');
      }}
    >
      Add New
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
      <form className={styles.form} onSubmit={(e) => onAddUpdateCamera(e)}>
        <div className={styles.textField}>
          <TextField
            id="outlined-basic"
            label="Camera Title"
            variant="outlined"
            value={titleInput}
            fullWidth={true}
            onChange={(e) => setTitleInput(e.target.value)}
          />
        </div>
        <div className={styles.textField}>
          <TextField
            id="outlined-basic"
            label="URL"
            variant="outlined"
            value={urlInput}
            fullWidth={true}
            onChange={(e) => setUrlInput(e.target.value)}
          />
        </div>
        <div className={styles.formButton}>
          <Button
            type="submit"
            variant="outlined"
            disabled={isSubmitCameraButtonDisabled(titleInput, urlInput)}
            size="small"
            color="primary"
            className={styles.button}
          >
            {formButtonText}
          </Button>
        </div>
      </form>
    );
  }

  if (statusCameras.status === ENV.STATUS_IDLE) {
    apiStatus = null;
  } else if (statusCameras.status === ENV.STATUS_WAITING) {
    apiStatus = <CircularProgress />;
  } else if (statusCameras.status === ENV.STATUS_ERROR) {
    apiStatus = (
      <div className={styles.errorMessage}>{statusCameras.message}</div>
    );
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
