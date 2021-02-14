import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import videoReducer from '../features/video/videoSlice';
import pageContainerReducer from '../features/pageContainer/pageContainerSlice';
import { loggingMiddleware } from '../middleware/logging';

export default configureStore({
  reducer: {
    pageContainer: pageContainerReducer,
    video: videoReducer,
  },
  middleware: [...getDefaultMiddleware(), loggingMiddleware],
});
