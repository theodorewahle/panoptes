import cv2 as cv
import numpy as np

class HOGDetectionModel():

    def __init__(self):
        
        # initialize the HOG descriptor
        self.hog = cv.HOGDescriptor()

        # use prebuilt person detector
        self.hog.setSVMDetector(cv.HOGDescriptor_getDefaultPeopleDetector())

    def detect(self, filepath):

        # open video
        video = cv.VideoCapture(filepath)

        while True:

            ret, frame = video.read()

            if frame is None:
                break

            for (xA, yA, xB, yB) in self.find_boxes(frame):

                # display the detected boxes in the colour picture
                cv.rectangle(frame, (xA, yA), (xB, yB), (0, 255, 0), 2)

            yield frame

    # helper function for placing boxes around people
    def find_boxes(self, frame):
    
        # convert to grayscale
        gray = cv.cvtColor(frame, cv.COLOR_RGB2GRAY)

        # detect people in the image
        # returns the bounding boxes for the detected objects
        boxes, weights = self.hog.detectMultiScale(frame, winStride=(8,8) )

        # convert to numpy array to draw the boxes
        return np.array([[x, y, x + w, y + h] for (x, y, w, h) in boxes])
