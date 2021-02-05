import React from 'react';
import Video from './features/video/Video';
import './App.css';

function App() {
  return (
    <div className='App'>
      <div style={{display: 'flex', flexDirection : 'column'}}>
      <div style={{backgroundColor: 'green', width: '100%', paddingLeft: 100, paddingRight: 100}}>
        <h1>Panoptes</h1>
      </div>
      <div style={{display: 'flex', flexDirection : 'row'}}>
      <Video url='"http://127.0.0.1:8000/static"' />
      <Video />
      <Video />
      </div>
      </div>
    </div>
  );
}

export default App;
