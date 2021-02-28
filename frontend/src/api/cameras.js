import store from '../app/store';

import {
  setStatusCameras,
  insertCameraToDataModel,
  deleteCameraFromDataModel,
} from '../features/video/videoSlice';

import axios from 'axios';
import ENV from '../env';

axios.defaults.headers.common = {
  'Access-Control-Allow_origin': '*',
  Authorization: `Bearer ${ENV.SECRET_TOKEN_STORED_IN_A_NOT_SO_SECRET_LOCATION}`,
};

export const addUpdateCamera = (params) => {
  const { formStatus, titleInput, urlInput, cameraId } = params;
  let config;
  if (formStatus === ENV.FORM_ADD_CAMERA) {
    config = {
      method: 'post',
      url: `${ENV.API_ENDPOINT}/cameras`,
      data: {
        title: titleInput,
        url: urlInput,
      },
    };
  } else if (formStatus === ENV.FORM_UPDATE_CAMERA) {
    config = {
      method: 'put',
      url: `${ENV.API_ENDPOINT}/cameras/${cameraId}`,
      data: {
        title: titleInput,
        url: urlInput,
      },
    };
  } else if (formStatus === ENV.FORM_DELETE_CAMERA) {
    config = {
      method: 'delete',
      url: `${ENV.API_ENDPOINT}/cameras/${cameraId}`,
    };
  } else {
    console.log('UI logic issue');
    return null;
  }

  axios(config)
    .then((res) => {
      console.log(`status: ${res.status}`);
      if (res.status === 200 || res.status === 201) {
        store.dispatch(
          insertCameraToDataModel({ update: formStatus, data: res.data })
        );
        store.dispatch(
          setStatusCameras({ status: ENV.STATUS_DONE, message: '' })
        );
      } else if (res.status === 204) {
        store.dispatch(deleteCameraFromDataModel({ cameraId }));
        store.dispatch(
          setStatusCameras({ status: ENV.STATUS_DONE, message: '' })
        );
      } else if (res.status === 400) {
        store.dispatch(
          setStatusCameras({
            status: ENV.STATUS_ERROR,
            message: `'${titleInput}' or '${urlInput}' is already in use.`,
          })
        );
      } else {
        setStatusCameras({
          status: ENV.STATUS_ERROR,
          message: 'Unknown Internal Server Error',
        });
      }
      console.log('');
    })
    .catch((err) => {
      console.log(err);
      store.dispatch(
        setStatusCameras({
          status: ENV.STATUS_ERROR,
          message: 'Internal Server Error. Please try again.',
        })
      );
    });
};
