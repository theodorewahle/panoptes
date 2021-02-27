/* eslint-disable no-unused-vars */
import store from '../app/store';
import {
  setMainDataModel,
  setStatusMainDataModel,
} from '../features/video/videoSlice';
import axios from 'axios';
import ENV from '../env';

axios.defaults.headers.common = {
  'Access-Control-Allow_origin': '*',
  Authorization: `Bearer ${ENV.SECRET_TOKEN_STORED_IN_A_NOT_SO_SECRET_LOCATION}`,
};

// TODO: fetch USER data (not all)
// Outline:
//    - (1) GET /cameras (Get All Cameras)
//    - (2) GET /incidents?camera_id={for each camera ID} - this eventually
//        should be merged with first API call
export const processDataModel = () => {
  console.log('processDataModel()');
  const endpoint1 = `${ENV.API_ENDPOINT}/cameras`;
  let endpoint2 = `${ENV.API_ENDPOINT}/incidents?camera_id=`;
  console.log(`fetchCameras(): ${endpoint1}`);
  console.log(`fetchCameras(): ${endpoint2}`);
  store.dispatch(setStatusMainDataModel(ENV.STATUS_WAITING));
  axios
    .get(endpoint1)
    .then((res) => {
      console.log('-------------------');
      console.log(res);
      // console.log(JSON.stringify(JSON.parse(res)));
      // store.dispatch(setMainDataModel(res));
      store.dispatch(setStatusMainDataModel(ENV.STATUS_DONE));
    })
    .catch((err) => {
      console.log(`axios err: ${JSON.stringify(err)}`);
      console.log(`ERROR ${endpoint1}: ${err}`);
      store.dispatch(setStatusMainDataModel(ENV.STATUS_ERROR));
      store.dispatch(setStatusMainDataModel([]));
    });
};
