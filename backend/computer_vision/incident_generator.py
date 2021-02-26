import os
import cv2
from yolo import YOLOVidClassificationModel, YOLOCamClassificationModel
from collections import Counter
# from database import add_incident


# def gen_motion_event():

class IncidentGenerator():
    def __init__(self, VIDEO=True):
        self.PATH = os.path.dirname(os.path.realpath(__file__))+"/../incidents/converted"
        if VIDEO:
            self.classifier = YOLOVidClassificationModel()
        # else:
            # self.classifier = YOLOCamClassificationModel()

    def parse_classes(self, class_list):
        classes = dict()
        curr_class = ""
        for word in class_list:
            if word.isdigit():
                if curr_class != "":
                    classes[curr_class] = quantity
                    quantity = 0
                    curr_class = ""
                quantity = int(word)
            else:
                if curr_class != "":
                    curr_class += " "
                if word[-2:] == "es":
                    curr_class += word[:-2]
                if word[-1] == "s":
                    curr_class += word[:-1]
                else:
                    curr_class += word

        classes[curr_class] = quantity
        return classes


    def gen_classifications(self, video_path, CLASS_PER_SECOND=4):
        classes = []
        
        for output in self.classifier.classify(video_path, CLASS_PER_SECOND):
            # if FPS == None:
            #     FPS = output
            # else:
            #     classes.append(output)
            classes.append(output)
        counter = 1
        second = 0
        classes_by_second = dict()
        temp_classes = Counter()
        for frame in classes:
            temp_classes += Counter(self.parse_classes(frame))
            if counter == CLASS_PER_SECOND:
                classes_by_second[second] = {k: int(round(v / CLASS_PER_SECOND)) for k, v in temp_classes.items() if int(round(v / CLASS_PER_SECOND)) != 0}
                counter = 1
                second += 1
                temp_classes = Counter()
            counter += 1
        print(classes_by_second)

        
        return (classes_by_second, second)

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

        for video_fname in video_fnames:
            video_path = os.path.join(DIR_PATH, video_fname)
            incidents[video_fname[:-4]] = self.gen_classifications(video_path)
        
        incident_starts = dict()
        curr_incident = None
        prev_incident = None

        text_incidents = []

        for video in incidents.keys():
            print(incidents[video][1])
            print(incidents[video][0])
            print()
            for second in range(incidents[video][1]):
                curr_incident = incidents[video][0][second]
                print(second, curr_incident)
                print(incident_starts)
                for obj in curr_incident.keys():
                    obj_quant = curr_incident[obj]
                    if not obj in incident_starts:
                        incident_starts[obj] = []
                        for i in range(obj_quant):
                            incident_starts[obj].append(second)
                    elif prev_incident != None:
                        prev_obj_quant = 0
                        if obj in prev_incident:
                            prev_obj_quant = prev_incident[obj]
                        
                        if obj_quant < prev_obj_quant:
                            for i in range(prev_obj_quant-obj_quant):
                                text_incidents.append(str(incident_starts[obj].pop())+" "+str(second)+" "+obj+" "+video)
                        elif obj_quant > prev_obj_quant:
                            for i in range(obj_quant-prev_obj_quant):
                                incident_starts[obj].append(second)
                prev_incident = curr_incident

        print("\nIncident requests generated:")
        for obj in incident_starts:
            while incident_starts[obj]:
                text_incidents.append(str(incident_starts[obj].pop())+" "+str(second)+" "+obj+" "+video)
        for t in text_incidents:
            print(t)
            
        # def add_incident(self, start_time, end_time, object_id, video_id):
        return "YEET"

# ig = IncidentGenerator(VIDEO=False)
ig = IncidentGenerator()
incidents = ig.gen_incidents("20210226", "9.mp4")
# ig.gen_incidents("20210226")
# print(ig.parse_classes(['2', 'persons', '1', 'fire', 'hydrant', '1', 'suitcase']))