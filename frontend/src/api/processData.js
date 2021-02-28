import store from '../app/store';
import {
  setMainDataModel,
  setStatusMainDataModel,
} from '../features/video/videoSlice';
import { setPage } from '../features/pageContainer/pageContainerSlice';
import axios from 'axios';
import ENV from '../env';

axios.defaults.headers.common = {
  'Access-Control-Allow_origin': '*',
  Authorization: `Bearer ${ENV.SECRET_TOKEN_STORED_IN_A_NOT_SO_SECRET_LOCATION}`,
};

// TODO: fetch USER data (not all)
// TODO: catch errors on individual API calls
// Outline:
//    - (1) GET /cameras (Get All Cameras)
//    - (2) GET /incidents?camera_id={for each camera ID}
//    - NOTE: Eventually, this should be merged with first API call
//         to avoid this relatively confusing Promise implementation
export const fetchAndProcessDataModel = () => {
  const endpoint1 = `${ENV.API_ENDPOINT}/cameras`;
  const endpoint2 = `${ENV.API_ENDPOINT}/incidents?camera_id=`;
  console.log(`fetchCameras(): ${endpoint1}`);
  console.log(`fetchCameras(): ${endpoint2}`);
  store.dispatch(setStatusMainDataModel(ENV.STATUS_WAITING));
  axios
    .get(endpoint1)
    .then((res) => {
      const { status, data } = res;
      if (status !== 200) {
        store.dispatch(setStatusMainDataModel(ENV.STATUS_ERROR));
        store.dispatch(setMainDataModel(null));
        store.dispatch(setPage(ENV.PAGE_LANDING)); // redundant but error is handled here
        return;
      }
      const cameras = data;
      // promise needed to pass cameras data through chain
      const cameraPromise = new Promise((resolve, reject) => {
        resolve({ cameras });
      });
      const incidentEndpoints = [];
      incidentEndpoints.push({ isUrl: false, data: cameras });
      cameras.forEach((cameraObj) => {
        incidentEndpoints.push({
          isUrl: true,
          data: `${endpoint2}${cameraObj.camera_id}`,
        });
      });
      return Promise.all(
        incidentEndpoints.map((obj) => {
          if (obj.isUrl === true) {
            return axios.get(obj.data);
          } else return cameraPromise;
        })
      );
    })
    .then((results) => {
      let mainDataModel = [];
      const { cameras } = results[0];
      const incidentsByCamera = results.slice(1);
      for (let i = 0; i < incidentsByCamera.length; i++) {
        const incidents = [];
        if (incidentsByCamera[i].status === 200) {
          let incidentIndex = 0;
          incidentsByCamera[i].data.forEach((incident) => {
            incidents.push({
              url:
                `${ENV.API_FILE_SERVER}/${incident[0]?.video_id}.mp4` ||
                'Video Not Found',
              startTime: incident[0]?.start_time || 'No Start Time',
              endTime: incident[0]?.end_time || 'No End Time',
              objectIdentified: incident[1]?.name || 'No Object Identified',
              object_id: incident[1]?.object_id || 'No object_id',
              object_set_id: incident[1]?.object_set_id || 'No object_set_id',
              incidentIndex,
            });
            incidentIndex++;
          });
          mainDataModel.push({
            title: cameras[i]?.title || 'No Title',
            url: cameras[i]?.url || 'No URL',
            camera_id: cameras[i]?.camera_id || 'No camera_id',
            cameraIndex: i,
            incidents,
          });
        }
      }
      store.dispatch(setStatusMainDataModel(ENV.STATUS_DONE));
      store.dispatch(setMainDataModel(mainDataModel));
    })
    .catch((err) => {
      console.log('AXIOS ERROR:');
      console.log(err);
      store.dispatch(setStatusMainDataModel(ENV.STATUS_ERROR));
      store.dispatch(setMainDataModel(null));
      store.dispatch(setPage(ENV.PAGE_LANDING));
    });
};
