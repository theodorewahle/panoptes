import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import videoReducer from '../features/video/videoSlice';
import { loggingMiddleware } from '../middleware/logging';

export default configureStore({
  reducer: {
    video: videoReducer,
  },
  middleware: [...getDefaultMiddleware(), loggingMiddleware],
});
