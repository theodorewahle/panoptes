import { createSlice } from '@reduxjs/toolkit';
import ENV from '../../env';

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    streamStatus: ENV.STATUS_STREAM_IDLE,
  },
  reducers: {
    setStreamStatus: (state, action) => {
      state.streamStatus = action.payload;
    },
  },
});

export const { setStreamStatus } = searchSlice.actions;

export const selectStreamStatus = (state) => state.video.streamStatus;

export default searchSlice.reducer;
