import { createSlice } from '@reduxjs/toolkit';
import ENV from '../../env';

export const pageContainerSlice = createSlice({
  name: 'pageContainer',
  initialState: {
    user: 'panoptes',
    page: ENV.PAGE_LANDING,
  },
  reducers: {
    setUser: (state, action) => {
      state.setUser = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    openSocket: (state) => {
      // handled in middleware/socket.js
    },
    closeSocket: (state) => {
      // handled in middleware/socket.js
    },
    emitSocketEvent: (state, action) => {
      // handled in middleware/socket.js
    },
  },
});

export const {
  setUser,
  setPage,
  openSocket,
  closeSocket,
} = pageContainerSlice.actions;

export const selectUser = (state) => state.pageContainer.user;
export const selectPage = (state) => state.pageContainer.page;

export default pageContainerSlice.reducer;
