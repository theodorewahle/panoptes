/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectMainDataModel } from '../../video/videoSlice';
import { isValidHttpUrl } from '../../../utilGeneral/utils';

import { TextField, Button } from '@material-ui/core';

import styles from './EditCamerasPage.module.scss';

const EditCamerasPage = () => {
  const [titleInput, setTitleInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isCameraBeingEdited, setIsCameraBeingEdited] = useState(false);
  const [cameras, setCameras] = useState([]);
  const mainDataModel = useSelector(selectMainDataModel);

  if (mainDataModel == null) return null;

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
          onClick={() => console.log('onClick()')}
        >
          {camera.isEditing ? 'Submit' : 'Edit'}
        </Button>
      </div>
    );
  });

  const onAddCamera = (e) => {
    e.preventDefault();
    console.log('onAddCamera: ping API');
  };

  return (
    <div className={styles.container}>
      <h1>Cameras</h1>
      {camerasList}
      <form className={styles.searchBar} onSubmit={(e) => onAddCamera(e)}>
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
          disabled={isSubmitCameraButtonDisabled(titleInput, urlInput)} // TODO
        >
          Go
        </Button>
      </form>
    </div>
  );
};

export default EditCamerasPage;
