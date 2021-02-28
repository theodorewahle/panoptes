import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectMainDataModel } from '../../video/videoSlice';
import { isValidHttpUrl } from '../../../utilGeneral/utils';

import { TextField, Button } from '@material-ui/core';

import styles from './EditCamerasPage.module.scss';

const EditCamerasPage = () => {
  const [titleInput, setTitleInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [editTitleInput, setEditTitleInput] = useState('');
  const [editUrlInput, setEditUrlInput] = useState('');
  // const [isCameraBeingEdited, setIsCameraBeingEdited] = useState(false);
  const [cameras, setCameras] = useState([]);
  const mainDataModel = useSelector(selectMainDataModel);

  useEffect(() => {
    let tempCameras = [];
    mainDataModel.forEach((camera) => {
      tempCameras.push({
        title: camera.title,
        url: camera.url,
        isEditing: false,
      });
    });
    setCameras(tempCameras);
  }, [mainDataModel]);

  const isSubmitCameraButtonDisabled = (title, url) => {
    if (url.length === 0 || title.length === 0) {
      return true;
    }
    if (!isValidHttpUrl(url)) {
      return true;
    }
    return false;
  };

  // const isEditSubmitDisabled = (title, url) => {
  //   if (isCameraBeingEdited)
  // };

  let key = -1;
  const camerasList = cameras.map((camera) => {
    key++;
    const onEditSubmit = () => {
      if (camera.isEditing) {
        console.log('TODO: PUT /cameras API');
        setCameras();
      } else {
        console.log('TODO: camera.isEditing===False -> display');
        camera.isEditing = true;
      }
    };
    let rowDisplay;
    if (camera.isEditing) {
      rowDisplay = (
        <div>
          <TextField
            id="outlined-basic"
            label="Camera Title"
            variant="outlined"
            value={editTitleInput}
            fullWidth={true}
            onChange={(e) => setEditTitleInput(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="URL"
            variant="outlined"
            value={editUrlInput}
            fullWidth={true}
            onChange={(e) => setEditUrlInput(e.target.value)}
          />
        </div>
      );
    } else {
      rowDisplay = (
        <div>
          <div>Title: {camera.title}</div>
          <div>URL: {camera.url}</div>
        </div>
      );
    }
    return (
      <div className={styles.cameraRowEdit} key={key}>
        {rowDisplay}
        <Button
          variant="outlined"
          size="large"
          // disabled={isEditSubmitDisabled(editTitleInput, editUrlInput)}
          onClick={() => onEditSubmit()}
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
