import store from '../App/store';
import {
  setCameras,
  setIncidents,
  setObjectSets,
  setObjects,
  setVideos,
  setStatusCameras,
  setStatusIncidents,
  setStatusObjectSets,
  setStatusObjects,
  setStatusVideos,
} from '../features/video/videoSlice';
import axios from 'axios';
import ENV from '../env';

axios.defaults.headers.common = {
  Authorization: `Bearer ${ENV.SECRET_TOKEN_STORED_IN_A_NOT_SO_SECRET_LOCATION}`,
};

// TODO: fetch USER data (not all)
export const fetchCameras = () => {
  const endpoint = `${ENV.API_ENDPOINT}${ENV.API_CAMERAS}`;
  console.log(`fetchCameras(): ${endpoint}`);
  store.dispatch(setStatusCameras(ENV.STATUS_WAITING));
  axios
    .get(endpoint)
    .then((res) => {
      // TODO:
      //  - process data
      //  - check response status
      store.dispatch(setCameras(res));
      store.dispatch(setStatusCameras(ENV.STATUS_DONE));
    })
    .catch((err) => {
      console.log(`ERROR ${endpoint}: ${err}`);
      store.dispatch(setStatusCameras(ENV.STATUS_ERROR));
      store.dispatch(setCameras(err));
    });
};

export const fetchIncidents = () => {
  const endpoint = `${ENV.API_ENDPOINT}${ENV.API_INCIDENTS}`;
  console.log(`fetchIncidents(): ${endpoint}`);
  store.dispatch(setStatusIncidents(ENV.STATUS_WAITING));
  axios
    .get(endpoint)
    .then((res) => {
      // TODO:
      //  - process data
      //  - check response status
      store.dispatch(setIncidents(res));
      store.dispatch(setStatusIncidents(ENV.STATUS_DONE));
    })
    .catch((err) => {
      console.log(`ERROR ${endpoint}: ${err}`);
      store.dispatch(setStatusIncidents(ENV.STATUS_ERROR));
      store.dispatch(setIncidents(err));
    });
};

export const fetchObjectSets = () => {
  const endpoint = `${ENV.API_ENDPOINT}${ENV.API_OBJECT_SETS}`;
  console.log(`fetchObjectSets(): ${endpoint}`);
  store.dispatch(setStatusObjectSets(ENV.STATUS_WAITING));
  axios
    .get(endpoint)
    .then((res) => {
      // TODO:
      //  - process data
      //  - check response status
      store.dispatch(setObjectSets(res));
      store.dispatch(setStatusObjectSets(ENV.STATUS_DONE));
    })
    .catch((err) => {
      console.log(`ERROR ${endpoint}: ${err}`);
      store.dispatch(setStatusObjectSets(ENV.STATUS_ERROR));
      store.dispatch(setObjectSets(err));
    });
};

export const fetchObjects = () => {
  const endpoint = `${ENV.API_ENDPOINT}${ENV.API_OBJECTS}`;
  console.log(`fetchObjects(): ${endpoint}`);
  store.dispatch(setStatusObjects(ENV.STATUS_WAITING));
  axios
    .get(endpoint)
    .then((res) => {
      // TODO:
      //  - process data
      //  - check response status
      store.dispatch(setObjects(res));
      store.dispatch(setStatusObjects(ENV.STATUS_DONE));
    })
    .catch((err) => {
      console.log(`ERROR ${endpoint}: ${err}`);
      store.dispatch(setStatusObjects(ENV.STATUS_ERROR));
      store.dispatch(setObjects(err));
    });
};

export const fetchVideos = () => {
  const endpoint = `${ENV.API_ENDPOINT}${ENV.API_VIDEOS}`;
  console.log(`fetchVideos(): ${endpoint}`);
  store.dispatch(setStatusVideos(ENV.STATUS_WAITING));
  axios
    .get(endpoint)
    .then((res) => {
      // TODO:
      //  - process data
      //  - check response status
      store.dispatch(setVideos(res));
      store.dispatch(setStatusVideos(ENV.STATUS_DONE));
    })
    .catch((err) => {
      console.log(`ERROR ${endpoint}: ${err}`);
      store.dispatch(setStatusVideos(ENV.STATUS_ERROR));
      store.dispatch(setVideos(err));
    });
};
