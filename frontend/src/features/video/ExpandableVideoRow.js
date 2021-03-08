import React from 'react';
import { Button } from '@material-ui/core';
import ENV from '../../env';
import Video from './Video';
import VideoThumbnails from '../video/VideoThumbnails';

import styles from './Video.module.scss';


class ExpandableVideoRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isOpen: false};  }
        
    render() {
        console.log(this.props)

            const video = this.props.videos[0]

            return (
                <div className={styles.expandableRow}>
            
                <div className={styles.header}> 
                <h1>{this.props.objectIdentified} ({this.props.videos.length})</h1>
                </div>   

                <div> 
                {this.state.isOpen === false && (
                    <Video
                    startTime={video.startTime}
                    endTime={video.endTime}
                    objectIdentified={video.objectIdentified}
                    timeStamp={video.timeStamp}
                    title={video.title}
                    url={video.url}
                    width={ENV.VIDEO_THUMBNAIL_WIDTH}
                    height={ENV.VIDEO_THUMBNAIL_HEIGHT}
                    pageLink={ENV.PAGE_INCIDENT_VIEWER}
                    videoType={ENV.VIDEO_TYPE_INCIDENT}
                    isThumbnail={true}
                    incidentIndex={video.incidentIndex}
                    cameraIndex={video.cameraIndex}
                    />
                )}
                {this.state.isOpen && (
                     <VideoThumbnails
                     videos={this.props.videos}
                     width={ENV.VIDEO_THUMBNAIL_WIDTH}
                     height={ENV.VIDEO_THUMBNAIL_HEIGHT}
                     isThumbnail={true}
                     pageLink={ENV.PAGE_INCIDENT_VIEWER}
                     videoType={ENV.VIDEO_TYPE_INCIDENT}
                   />
                )}
            
                </div>
                    {this.props.videos.length > 1 && (
                        <div className={styles.footer}> 
                            <Button
                            onClick={() => { this.setState({ isOpen: !this.state.isOpen })}}
                            color='inherit'
                            variant="outlined"
                            size="small"
                            >
                            {this.state.isOpen ? 'Hide Group' : 'Show All'}
                            </Button>
                        </div>
                    )}
                </div>
            )


        //   const thumbnails = videos.map((video) => {
        //     i++;
        //     return (
        //     <div key={i}>
        //         <Video
        //         startTime={video.startTime}
        //         endTime={video.endTime}
        //         objectIdentified={video.objectIdentified}
        //         timeStamp={video.timeStamp}
        //         title={video.title}
        //         url={video.url}
        //         width={width}
        //         height={height}
        //         isThumbnail={isThumbnail}
        //         videoType={videoType}
        //         pageLink={pageLink}
        //         incidentIndex={video.incidentIndex}
        //         cameraIndex={video.cameraIndex}
        //         />
        //     </div>
        //     );
        // });
    }
}
export default ExpandableVideoRow
