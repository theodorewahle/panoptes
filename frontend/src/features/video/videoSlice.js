import { createSlice } from '@reduxjs/toolkit';
import {
  initRecentIncidents,
  objectSets,
  // tempDataMainDataModel,
} from '../video/data';
import ENV from '../../env';

export const videoSlice = createSlice({
  name: 'video',
  initialState: {
    cameras: [], // [{ title, url }, ...]
    incidents: [], // [{ }]
    objectSets: objectSets, // [{ name, object_set_id, objects=[name, ...] }, ...]
    objects: [], // not using
    videos: [],
    mainDataModel: [],

    statusCameras: ENV.STATUS_IDLE,
    statusIncidents: ENV.STATUS_IDLE,
    statusObjectSets: ENV.STATUS_IDLE,
    statusObjects: ENV.STATUS_IDLE,
    statusVideos: ENV.STATUS_IDLE,
    statusMainDataModel: ENV.STATUS_IDLE,

    streamStatus: ENV.STATUS_STREAM_IDLE,
    objectSet: [],
    streams: [],
    recentIncidents: initRecentIncidents,

    curIncidentIndex: 0,
    curCameraIndex: 1,
    searchResults: [],
  },
  reducers: {
    setCameras: (state, action) => {
      state.cameras = action.payload;
    },
    setIncidents: (state, action) => {
      state.incidents = action.payload;
    },
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
    setVideos: (state, action) => {
      state.videos = action.payload;
    },
    setMainDataModel: (state, action) => {
      console.log(`setMainDataModel: ${action.payload.toString()}`);
      state.mainDataModel = action.payload;
    },

    setStatusCameras: (state, action) => {
      state.statusCameras = action.payload;
    },
    setStatusIncidents: (state, action) => {
      state.statusIncidents = action.payload;
    },
    setStatusObjectSets: (state, action) => {
      state.statusObjectSets = action.payload;
    },
    setStatusObjects: (state, action) => {
      state.statusObjects = action.payload;
    },
    setStatusVideos: (state, action) => {
      state.statusVideos = action.payload;
    },
    setStatusMainDataModel: (state, action) => {},

    setStreamStatus: (state, action) => {
      state.streamStatus = action.payload;
    },
    addObject: (state, action) => {
      state.objectSet.push(action.payload);
    },
    setObjectSet: (state, action) => {
      state.objectSet = action.payload;
    },
    addStream: (state, action) => {
      state.streams.push(action.payload);
    },
    setStreams: (state, action) => {
      state.streams = action.payload;
    },
    setRecentIncidents: (state, action) => {
      state.recentIncidents = action.payload;
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
  },
});

export const {
  setCameras,
  setIncidents,
  setObjectSets,
  setObjects,
  setVideos,
  setMainDataModel,

  setStatusCameras,
  setStatusIncidents,
  setStatusObjectSets,
  setStatusObjects,
  setStatusVideos,
  setStatusMainDataModel,

  setStreamStatus,
  addObject,
  setObjectSet,
  setStreams,
  setRecentIncidents,
  setCurIncidentIndex,
  setCurCameraIndex,
  setSearchResults,
} = videoSlice.actions;

export const selectCameras = (state) => state.video.cameras;
export const selectIncidents = (state) => state.video.incidents;
export const selectObjectSets = (state) => state.video.objectSets;
export const selectObjects = (state) => state.video.objects;
export const selectVideos = (state) => state.video.videos;
export const selectMainDataModel = (state) => state.video.mainDataModel;

export const selectStatusCameras = (state) => state.video.statusCameras;
export const selectStatusIncidents = (state) => state.video.statusIncidents;
export const selectStatusObjectSets = (state) => state.video.statusObjectSets;
export const selectStatusObjects = (state) => state.video.statusObjects;
export const selectStatusVideos = (state) => state.video.statusVideos;
export const selectStatusMainDataModel = (state) => state.video.mainDataModel;

export const selectStreamStatus = (state) => state.video.streamStatus;
export const selectObjectSet = (state) => state.video.objectSet;
export const selectStreams = (state) => state.video.streams;
export const selectRecentIncidents = (state) => state.video.recentIncidents;
export const selectCurIncidentIndex = (state) => state.video.curIncidentIndex;
export const selectCurCameraIndex = (state) => state.video.curCameraIndex;
export const selectSearchResults = (state) => state.video.searchResults;

export default videoSlice.reducer;
