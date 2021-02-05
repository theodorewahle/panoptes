import { createSlice } from '@reduxjs/toolkit';

export const pageContainerSlice = createSlice({
  name: 'pageContainer',
  initialState: {
    user: 'panoptes',
  },
  reducers: {
    setUser: (state, action) => {
      state.setUser = action.payload;
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

export const { setUser, openSocket, closeSocket } = pageContainerSlice.actions;

export const selectUser = (state) => state.pageContainer.user;

export default pageContainerSlice.reducer;
