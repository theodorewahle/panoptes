/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectMainDataModel } from '../../video/videoSlice';
import { isValidHttpUrl } from '../../../utilGeneral/utils';

import { TextField, Button } from '@material-ui/core';

import styles from './EditCamerasPage.module.scss';

const EditCamerasPage = () => {
  // maybe put in ENV.js
  const FORM_IDLE = 0;
  const FORM_UPDATE_CAMERA = 1;
  const FORM_ADD_CAMERA = 2;
  const [titleInput, setTitleInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [cameraId, setCameraId] = useState('');
  const [formStatus, setFormStatus] = useState(FORM_IDLE);
  const mainDataModel = useSelector(selectMainDataModel);

  if (mainDataModel == null) return null;

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
        <Button
          variant="outlined"
          size="large"
          // disabled={isEditSubmitDisabled(editTitleInput, editUrlInput)}
          onClick={() => {
            setFormStatus(FORM_UPDATE_CAMERA);
            setCameraId(camera.camera_id);
            setTitleInput(camera.title);
            setUrlInput(camera.url);
          }}
        >
          Edit
        </Button>
      </div>
    );
  });

  const onAddUpdateCamera = (e) => {
    e.preventDefault();
    if (formStatus === FORM_ADD_CAMERA) {
    } else if (formStatus === FORM_UPDATE_CAMERA) {
    } else {
      console.log('Bad UI logic - display error?');
    }
  };

  let cameraButtonTitleRow = (
    <Button
      variant="outlined"
      size="large"
      onClick={() => {
        setFormStatus(FORM_ADD_CAMERA);
        setTitleInput('');
        setUrlInput('');
      }}
    >
      Add New Camera
    </Button>
  );

  let form;
  if (formStatus === FORM_IDLE) {
    form = null;
  } else {
    let formButtonText = '';
    if (formStatus === FORM_ADD_CAMERA) {
      formButtonText = 'Add Camera';
      cameraButtonTitleRow = null;
    } else if (formStatus === FORM_UPDATE_CAMERA) {
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

  return (
    <div className={styles.container}>
      <div className={styles.cameraTitleRow}>
        <h1>Cameras</h1>
        {cameraButtonTitleRow}
      </div>
      {camerasList}
      {form}
    </div>
  );
};

export default EditCamerasPage;
