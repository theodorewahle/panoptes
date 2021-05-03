import thumbnail1 from './1.png';
import thumbnail2 from './2.png';
import thumbnail3 from './3.png';
import thumbnail4 from './4.png';
import thumbnail5 from './5.png';
import thumbnail6 from './6.png';
import thumbnail7 from './7.png';
import thumbnail8 from './8.png';
import thumbnail9 from './9.png';
import thumbnail10 from './10.png';
import thumbnail11 from './11.png';
import thumbnail12 from './12.png';

// temporary until thumbnails are provided through API
export const getImage = (videoUrl) => {
  if (videoUrl === 'http://127.0.0.1:8080/video/1.mp4') {
    return thumbnail1;
  } else if (videoUrl === 'http://127.0.0.1:8080/video/2.mp4') {
    return thumbnail2;
  } else if (videoUrl === 'http://127.0.0.1:8080/video/3.mp4') {
    return thumbnail3;
  } else if (videoUrl === 'http://127.0.0.1:8080/video/4.mp4') {
    return thumbnail4;
  } else if (videoUrl === 'http://127.0.0.1:8080/video/5.mp4') {
    return thumbnail5;
  } else if (videoUrl === 'http://127.0.0.1:8080/video/6.mp4') {
    return thumbnail6;
  } else if (videoUrl === 'http://127.0.0.1:8080/video/7.mp4') {
    return thumbnail7;
  } else if (videoUrl === 'http://127.0.0.1:8080/video/8.mp4') {
    return thumbnail8;
  } else if (videoUrl === 'http://127.0.0.1:8080/video/9.mp4') {
    return thumbnail9;
  } else if (videoUrl === 'http://127.0.0.1:8080/video/10.mp4') {
    return thumbnail10;
  } else if (videoUrl === 'http://127.0.0.1:8080/video/11.mp4') {
    return thumbnail11;
  } else if (videoUrl === 'http://127.0.0.1:8080/video/12.mp4') {
    return thumbnail12;
  }
};
