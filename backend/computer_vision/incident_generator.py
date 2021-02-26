import os
import cv2
from yolo import YOLOVidClassificationModel, YOLOCamClassificationModel
# from database import add_incident

# def gen_motion_event():

class IncidentGenerator():
    def __init__(self, VIDEO=True):
        self.PATH = os.path.dirname(os.path.realpath(__file__))+"/../incidents/converted"
        if VIDEO:
            self.classifier = YOLOVidClassificationModel()
        else:
            self.classifier = YOLOCamClassificationModel()

    def gen_classifications(self, video_path):
        FPS = None
        classes = []
        for output in self.classifier.classify(video_path):
            if FPS == None:
                FPS = output
            else:
                classes.append(output)
        print(classes)
        return FPS, classes

    # TODO: implement all dates similar to all videos
    def gen_incidents(self, DATE="*", VIDEO_FNAME="*"):
        DIR_PATH = os.path.join(self.PATH, DATE)

        if VIDEO_FNAME == "*":
            video_fnames = [f for f in os.listdir(DIR_PATH) if os.path.isfile(os.path.join(DIR_PATH, f)) and f[-4:] == ".mp4"]
        elif os.path.isfile(os.path.join(DIR_PATH, VIDEO_FNAME)):
            video_fnames = [VIDEO_FNAME]
        else:
            return "ERROR NO FILE FOUND"

        incidents = dict()

        print(video_fnames)
        for video_fname in video_fnames:
            video_path = os.path.join(DIR_PATH, video_fname)
            incidents[video_fname[:-4]] = self.gen_classifications(video_path)
        return incidents

    def post_incidents(self, incidents):
        print(incidents)
        # def add_incident(self, start_time, end_time, object_id, video_id):
        return "YEET"

ig = IncidentGenerator()
incidents = ig.gen_incidents("20210226", "12.mp4")
ig.post_incidents(incidents)
# ig.gen_incidents("20210226")