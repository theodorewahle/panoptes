import { createSlice } from '@reduxjs/toolkit';
import ENV from '../../env';

export const videoSlice = createSlice({
  name: 'video',
  initialState: {
    streamStatus: ENV.STATUS_STREAM_IDLE,
    objectSet: [],
    streams: [],
    recentIncidents: [],
  },
  reducers: {
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
  },
});

export const {
  setStreamStatus,
  addObject,
  setObjectSet,
  setStreams,
  setRecentIncidents,
} = videoSlice.actions;

export const selectStreamStatus = (state) => state.video.streamStatus;
export const selectObjectSet = (state) => state.video.objectSet;

export default videoSlice.reducer;
