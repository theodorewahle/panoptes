import cv2 as cv
import numpy as np
import  datetime
import threading
import time
import random

class HOGDetectionModel():

    def __init__(self):
        self.FOLDER_NAME = "video_stream/"
        # initialize the HOG descriptor
        self.hog = cv.HOGDescriptor()

        # use prebuilt person detector
        self.hog.setSVMDetector(cv.HOGDescriptor_getDefaultPeopleDetector())

        self.video = cv.VideoCapture("rtsp://admin:admin@172.24.28.36/11")
        self.fps = self.video.get(cv.CAP_PROP_FPS)
        self.width = self.video.get(cv.CAP_PROP_FRAME_WIDTH)
        self.height = self.video.get(cv.CAP_PROP_FRAME_WIDTH)
        frameSize = (self.width, self.height)
        self.fourcc = cv.VideoWriter_fourcc(*'mp4v')
        file_name = "output.mp4"   
        print(self.fps, self.width, self.height)
        self.out = cv.VideoWriter(self.FOLDER_NAME + file_name, self.fourcc, int(self.fps), (int(self.width), int(self.height)))

    def __del__(self):
        #self.out.release()
        cv.destroyAllWindows()


    def stream(self, filepath):
        record_video = threading.Thread(target=self.record_live_video, args=("rtsp://admin:admin@172.24.28.36/11",))
        record_video.start()

    def record_live_video(self, filepath):     
        update_writer_thread = threading.Thread(target=self.update_file_names)
        update_writer_thread.start()
        while True:
            # cv.waitKey(100)
            # get frame
            ret, frame = self.video.read()

            if frame is None:
                break

            # # iterate through bounding boxes
            # for (xA, yA, xB, yB) in self.find_boxes(frame):
               
            #     # display the detected boxes in the colour picture
            #     cv.rectangle(frame, (xA, yA), (xB, yB), (0, 255, 0), 2)
    
            self.out.write(frame)
            
        self.out.release()
        self.video.release()

    # def stream_playback(self):

    #     # cv.imshow('Frame', frame)
    #         #yield frame
    #     ret, buffer = cv.imencode('.jpg', frame)
    #     frame = buffer.tobytes()
    #     yield (b'--frame\r\n'
    #             b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result


    # helper function for placing boxes around people
    def find_boxes(self, frame):
    
        # convert to grayscale
        gray = cv.cvtColor(frame, cv.COLOR_RGB2GRAY)

        # detect people in the image
        # returns the bounding boxes for the detected objects
        boxes, weights = self.hog.detectMultiScale(frame, winStride=(8,8) )

        # convert to numpy array to draw the boxes
        return np.array([[x, y, x + w, y + h] for (x, y, w, h) in boxes])

    def roundTime(self):
        """Round a datetime object to any time lapse in seconds
        dt : datetime.datetime object, default now.
        roundTo : Closest number of seconds to round to, default 1 minute.
        Author: Thierry Husson 2012 - Use it as you want but don't blame me.
        """
        roundTo = 60
        dt = datetime.datetime.now()
        seconds = (dt.replace(tzinfo=None) - dt.min).seconds
        rounding = (seconds+roundTo/2) // roundTo * roundTo
        return str(dt + datetime.timedelta(0,rounding-seconds,-dt.microsecond)).replace(" ", "_").replace("-", "_").replace(":", "_")

    def update_file_names(self):
        counter = 1
        while True:
            print("60 seconds has passed")

            # file_name = self.roundTime() + ".mp4"
            file_name = str(counter) + ".mp4"

            self.out = cv.VideoWriter(self.FOLDER_NAME + file_name, self.fourcc, int(self.fps), (int(self.width), int(self.height)))
            time.sleep(10)
            counter += 1
          

