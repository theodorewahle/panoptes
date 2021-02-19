import React from 'react';

import VideoThumbnails from '../../video/VideoThumbnails';
import styles from './LiveStreamPage.module.scss';
import ENV from '../../../env';
import ReactPlayer from 'react-player';

class LiveStreamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerVideo : {
        title: 'Live Video Feed',
        url : 'http://localhost:8080/webcam.ogg',
        type: 'video/ogg'
      },
      incidents : [
        {
          title: 'Woman Walking With Notebook',
          url: 'http://127.0.0.1:8000/incident/20210218/A210218_003304_003318.mp4',
          type: 'video/mp4'
        },
        {
          title: 'Garbage Truck',
          url: 'http://127.0.0.1:8000/incident/20210219/A210219_234913_234927.mp4',
          type: 'video/mp4'
        },
        {
          title: 'Woman With Suspicious Dog',
          url: 'http://127.0.0.1:8000/incident/20210218/A210218_020152_020207.mp4',
          type: 'video/mp4'
        },
        {
          title: 'Inividual Removes Suspicious Envelope From Vehicle',
          url: 'http://127.0.0.1:8000/incident/20210218/A210218_032104_032118.mp4',
          type: 'video/mp4'
        },
        {
          title: 'Suspicious Trio Enters Vehicle, Camera Disturbance',
          url: 'http://127.0.0.1:8000/incident/20210219/A210219_122703_122717.mp4',
          type: 'video/mp4'
        },
      ]
    };  
  }
  
  onSelect = (video) => {
    this.setState({ playerVideo: video })
  }

  resetFeed = () => {
    this.setState({
      playerVideo: {
        title: 'Live Video Feed',
        url : 'http://localhost:8080/webcam.ogg',
        type: 'video/ogg'
      }
    })
  }

  render() {

    return (
      <div>
        <div className={styles.containerLiveStream}> 
        <div className={styles.containerStreamData}>
          <h1>Alpha Chi Alpha — Parking Lot</h1>
          <h2>Now Playing: {this.state.playerVideo.title}</h2>
          <h3>Recent Incidents: {this.state.incidents.length}</h3>
          <button onClick={this.resetFeed}>
            Return to Live Feed
          </button>
        </div>
        <div>
          <ReactPlayer url={this.state.playerVideo.url} width={720} height={405} playing />
        </div>
        </div>
  
        <div className={styles.containerRecentIncidents}>
          <div className={styles.titleRecentIncidents}>Recent Incidents</div>
          <VideoThumbnails
            videos={this.state.incidents}
            width={ENV.VIDEO_THUMBNAIL_WIDTH}
            height={ENV.VIDEO_THUMBNAIL_HEIGHT}
            onSelect={this.onSelect}
          />
        </div>
      </div>
    );
  }
}


export default LiveStreamPage;
