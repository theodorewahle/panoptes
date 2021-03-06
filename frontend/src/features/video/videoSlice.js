import { createSlice } from '@reduxjs/toolkit';
import {
  objectSets,
  // tempDataMainDataModel,
} from '../video/data';
import ENV from '../../env';
// import { act } from 'react-dom/test-utils';

export const videoSlice = createSlice({
  name: 'video',
  initialState: {
    objectSets: objectSets,
    mainDataModel: [],
    statusCameras: {
      status: ENV.STATUS_IDLE,
      message: '',
    },
    statusObjectSets: ENV.STATUS_IDLE,
    statusMainDataModel: ENV.STATUS_IDLE,
    curIncidentIndex: 0,
    curCameraIndex: 1,
    searchAllObjects: '',
    searchResults: [],
    searchFilterCameras: {},
    searchFilterObjects: {},
    statusSearch: {
      status: ENV.STATUS_IDLE,
      message: '',
    },
  },
  reducers: {
    setObjectSets: (state, action) => {
      state.objectSets = action.payload;
    },
    addObjectSet: (state, action) => {
      const { setName } = action.payload;
      state.objectSets.push({ setName, objects: [] });
    },
    addObjectToSet: (state, action) => {
      const { setName, objectName } = action.payload;
      state.objectSets.forEach((objectSet) => {
        if (objectSet.name === setName) {
          objectSet.objects.push(objectName);
        }
      });
    },
    setMainDataModel: (state, action) => {
      if (action.payload === null) {
        return;
      }
      state.mainDataModel = action.payload;
      let cameras = {};
      const objects = [];
      for (let i = 0; i < action.payload.length; i++) {
        const title = action.payload[i].title;
        cameras[title] = true;
        for (let j = 0; j < action.payload[i].incidents.length; j++) {
          const object = action.payload[i].incidents[j].objectIdentified;
          if (!objects.includes(object)) {
            objects.push(object);
          }
        }
      }
      state.searchAllObjects = objects.join(' ');
      state.searchFilterCameras = cameras;
    },
    insertCameraToDataModel: (state, action) => {
      const { update, data } = action.payload;
      if (update === ENV.FORM_UPDATE_CAMERA) {
        state.mainDataModel.forEach((camera) => {
          if (camera.camera_id === data.camera_id) {
            camera.title = data.title;
            camera.url = data.url;
            camera.camera_id = data.camera_id;
          }
        });
      } else {
        state.mainDataModel.push({
          title: data.title,
          url: data.url,
          camera_id: data.camera_id,
          incidents: [],
        });
      }
    },
    deleteCameraFromDataModel: (state, action) => {
      const { cameraId } = action.payload;
      const newArr = state.mainDataModel.filter((camera) => {
        return camera.camera_id !== cameraId;
      });
      state.mainDataModel = newArr;
    },

    setStatusCameras: (state, action) => {
      const { status, message } = action.payload;
      let messageTemp = '';
      if (message != null) messageTemp = message;
      state.statusCameras = { status, message: messageTemp };
    },
    setStatusObjectSets: (state, action) => {
      state.statusObjectSets = action.payload;
    },
    setStatusMainDataModel: (state, action) => {
      state.statusMainDataModel = action.payload;
    },

    setCurIncidentIndex: (state, action) => {
      state.curIncidentIndex = action.payload;
    },
    setCurCameraIndex: (state, action) => {
      state.curCameraIndex = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchFilterCameras: (state, action) => {
      const { name, value } = action.payload;
      state.searchFilterCameras[name] = value;
    },
    setSearchFilterObjects: (state, action) => {
      const { name, value } = action.payload;
      if (name == null || value == null) {
        state.searchFilterObjects = action.payload;
      }
      state.searchFilterObjects[name] = value;
    },
    setStatusSearch: (state, action) => {
      const { status, message, messageFilter } = action.payload;
      let messageTemp = '';
      let messageFilterTemp = '';
      if (message != null) messageTemp = message;
      if (messageFilter != null) messageFilterTemp = messageFilter;
      state.statusSearch = {
        status,
        message: messageTemp,
        messageFilter: messageFilterTemp,
      };
    },
  },
});

export const {
  setObjectSets,
  setMainDataModel,
  insertCameraToDataModel,
  deleteCameraFromDataModel,

  setStatusCameras,
  setStatusObjectSets,
  setStatusMainDataModel,

  setObjectSet,
  setCurIncidentIndex,
  setCurCameraIndex,
  setSearchResults,
  setSearchFilterCameras,
  setSearchFilterObjects,
  setStatusSearch,
} = videoSlice.actions;

export const selectCameras = (state) => state.video.cameras;
export const selectObjectSets = (state) => state.video.objectSets;
export const selectMainDataModel = (state) => state.video.mainDataModel;

export const selectStatusCameras = (state) => state.video.statusCameras;
export const selectStatusObjectSets = (state) => state.video.statusObjectSets;
export const selectStatusMainDataModel = (state) =>
  state.video.statusMainDataModel;
export const selectSearchFilterCameras = (state) =>
  state.video.searchFilterCameras;
export const selectSearchFilterObjects = (state) =>
  state.video.searchFilterObjects;

export const selectObjectSet = (state) => state.video.objectSet;
export const selectCurIncidentIndex = (state) => state.video.curIncidentIndex;
export const selectCurCameraIndex = (state) => state.video.curCameraIndex;
export const selectSearchResults = (state) => state.video.searchResults;
export const selectStatusSearch = (state) => state.video.statusSearch;
export const selectSearchAllObjects = (state) => state.video.searchAllObjects;

export default videoSlice.reducer;
