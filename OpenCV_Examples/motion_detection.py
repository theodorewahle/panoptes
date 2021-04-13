
import cv2 as cv
from abc import ABC

# abstract class for motion detection models
class MotionDetectionModel(ABC):

    def __init__(self, minimum_bounding_box=25, history=500, detect_shadows=True):
        self.minimum_bounding_box = minimum_bounding_box
        self.history = history
        self.detect_shadows = detect_shadows

        # will be initialized in child constructor
        self.background_subtractor = None

    # generator for drawing boxes around outer contours on video frames (from filepath)
    def detect(self, filepath):

        # read in video from filepath
        video = cv.VideoCapture(filepath)

        while True:

            # get the current frame
            ret, frame = video.read()
            
            # end of video
            if frame is None:
                break
            
            # get foreground mask
            foreground_mask = self.background_subtractor.apply(frame)

            # find contours and draw them
            contours, hierarchy = cv.findContours(foreground_mask, cv.RETR_TREE, cv.CHAIN_APPROX_NONE)
            
            # disregard children contours
            try: 
                hierarchy = hierarchy[0]
            except: 
                hierarchy = []

             # get dimensions for contour boxes
            height, width = foreground_mask.shape
            min_x, min_y = width, height
            max_x = max_y = 0

            # computes the bounding box for the contour
            for contour, hier in zip(contours, hierarchy):
                (x,y,w,h) = cv.boundingRect(contour)
                min_x, max_x = min(x, min_x), max(x+w, max_x)
                min_y, max_y = min(y, min_y), max(y+h, max_y)

                # draw the contour bounding box on the frame
                if w > self.minimum_bounding_box and h > self.minimum_bounding_box:
                    cv.rectangle(frame, (x,y), (x+w,y+h), (255, 0, 0), 2)
            
            yield frame


# child class using KNN subtraction
class KNNMotionDetection(MotionDetectionModel):
    
    def __init__(self, minimum_bounding_box=25, history=500, detect_shadows=True, dist2Threshold=400.0):
        super().__init__(minimum_bounding_box, history, detect_shadows)
        self.dist2Threshold = dist2Threshold
        self.background_subtractor = cv.createBackgroundSubtractorKNN(history=self.history, dist2Threshold=self.dist2Threshold, detectShadows=self.detect_shadows)


# child class using MOG2
class MOG2MotionDetection(MotionDetectionModel):

    def __init__(self, minimum_bounding_box=25, history=500, detect_shadows=True, varThreshold=16):
        super().__init__(minimum_bounding_box, history, detect_shadows)
        self.varThreshold = varThreshold
        self.background_subtractor = cv.createBackgroundSubtractorMOG2(history=self.history, varThreshold=self.varThreshold, detectShadows=self.detect_shadows)

