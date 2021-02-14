import { createSlice } from '@reduxjs/toolkit';
import ENV from '../../env';

// TODO: consider merging videoSlice.js here
export const pageContainerSlice = createSlice({
  name: 'pageContainer',
  initialState: {
    user: 'panoptes',
    page: ENV.PAGE_LANDING,
    searchInput: '',
    searchCurrent: '',
  },
  reducers: {
    setUser: (state, action) => {
      state.setUser = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearchInput: (state, action) => {
      state.searchInput = action.payload;
    },
    setSearchCurrent: (state, action) => {
      state.searchCurrent = action.payload;
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
  setSearchInput,
  setSearchCurrent,
  openSocket,
  closeSocket,
} = pageContainerSlice.actions;

export const selectUser = (state) => state.pageContainer.user;
export const selectPage = (state) => state.pageContainer.page;
export const selectSearchInput = (state) => state.pageContainer.searchInput;
export const selectSearchCurrent = (state) => state.pageContainer.searchCurrent;

export default pageContainerSlice.reducer;
