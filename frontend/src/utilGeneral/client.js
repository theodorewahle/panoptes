import { useEffect, useLayoutEffect, useState } from 'react';

// https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

export const useMousePosition = () => {
  const [mousePos, setMousePos] = useState([null, null]);
  const updateMousePos = (e) => {
    setMousePos([e.clientX, e.clientY]);
  };
  useEffect(() => {
    window.addEventListener('mousemove', updateMousePos);
    return () => window.removeEventListener('mousemove', updateMousePos);
  }, []);
  return mousePos;
};
