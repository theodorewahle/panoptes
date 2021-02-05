import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openSocket, closeSocket } from './pageContainerSlice';
import Video from '../video/Video';

// This component doubles as a socketWrapper
const PageContainer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(openSocket());
    return () => {
      dispatch(closeSocket());
    };
  });
  return (
    <div>
      <Video />
    </div>
  );
};

export default PageContainer;
