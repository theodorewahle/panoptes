import { createSlice } from '@reduxjs/toolkit';
import ENV from '../../env';

export const videoSlice = createSlice({
  name: 'video',
  initialState: {
    streamStatus: ENV.STATUS_STREAM_IDLE,
  },
  reducers: {
    setStreamStatus: (state, action) => {
      state.streamStatus = action.payload;
    },
  },
});

export const { setStreamStatus } = videoSlice.actions;

export const selectStreamStatus = (state) => state.video.streamStatus;

export default videoSlice.reducer;
