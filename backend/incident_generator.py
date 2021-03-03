import os
import cv2
from computer_vision.yolo import YOLOVidClassificationModel, YOLOCamClassificationModel
from collections import Counter

# Class to generate incidents using the yolo model
# does not yet send post requests to db
class IncidentGenerator():
    def __init__(self, VIDEO=True):
        # get the path to the incidents/converted file that holds the converted videos
        self.PATH = os.path.dirname(os.path.realpath(__file__))+"/incidents/converted"

        # initialize the yolo classification model
        self.classifier = YOLOVidClassificationModel()

    # takes the text output from the yolo model 
    # converts it into a dictionary of class and their quantity
    def parse_classes(self, class_list):
        classes = dict()
        # check if there is an outputted text
        if len(class_list) > 0: 
            curr_class = ""

            for word in class_list:
                # if there is a number save the previous count, class pair and reset the word
                if word.isdigit():
                    if curr_class != "":
                        classes[curr_class] = quantity
                        quantity = 0
                        curr_class = ""
                    quantity = int(word)
            
                # the class can be multiple words so this handle consecutive strings
                else:
                    if curr_class != "":
                        curr_class += " "
                    curr_class += word
            classes[curr_class] = quantity 
        return classes

    # output the classifiation
    def gen_classifications(self, video_path, CLASS_PER_SECOND=4):
        classes = []
        
        # get outputs from yolo classification model
        for output in self.classifier.classify(video_path, CLASS_PER_SECOND):
            classes.append(output)

        # create a dict of the classes at each second in the model
        counter = 1
        second = 0
        classes_by_second = dict()
        temp_classes = Counter()

        # takes the average of the classifications accross one second as the classification for that second
        for frame in classes:
            # aggregate the classifications
            temp_classes += Counter(self.parse_classes(frame))

            # average the classifications and remove classifications present in less than half 
            if counter == CLASS_PER_SECOND:
                classes_by_second[second] = {k: int(round(v / CLASS_PER_SECOND)) for k, v in temp_classes.items() if int(round(v / CLASS_PER_SECOND)) != 0}
                counter = 1
                second += 1
                temp_classes = Counter()
            counter += 1
        
        # returns the classes at each second and the length of the video in seconds
        return classes_by_second, second
        
    # as text incidents are generated in different ways, helps keep track
    def text_incidents_helper(self, start, end, obj, video_path):
        return str(start)+" "+str(end)+" "+obj+" "+video_path+"\n"

    # creates an incidents.txt file containing the params for the incidents of the videos that the program was aimed at
    def gen_incidents(self, DATE="*", VIDEO_FNAME="*"):
        # variables to generate text output
        text_incidents = []

        # get all date directories or select a single one
        if DATE == "*":
            DIR_PATHS = [os.path.join(self.PATH, d) for d in os.listdir(self.PATH) if os.path.isdir(os.path.join(self.PATH, d))]
        else:
            DIR_PATHS = [os.path.join(self.PATH, DATE)]

        # loop through all directory paths
        for DIR_PATH in DIR_PATHS:
            # select which videos to classify
            if VIDEO_FNAME == "*":
                video_fnames = [f for f in os.listdir(DIR_PATH) if os.path.isfile(os.path.join(DIR_PATH, f)) and f[-4:] == ".mp4"]
            elif os.path.isfile(os.path.join(DIR_PATH, VIDEO_FNAME)):
                video_fnames = [VIDEO_FNAME]
            else:
                print("ERROR NO FILE FOUND")
                return None
            
            # get the incidents from our classifier in classifications per second dictionary form
            for video_fname in video_fnames:
                print(video_fname)
                video_path = os.path.join(DIR_PATH, video_fname)
                incidents, seconds = self.gen_classifications(video_path)
            
                # initialize a dictionary of objects classified as keys
                # the value is a stack of start times
                incident_starts = dict()
                curr_incident = None
                prev_incident = None

                # loop through the seconds of the classifications
                for second in range(seconds):
                    # get the current incident
                    curr_incident = incidents[second]

                    # loop through the classifications for this second
                    for obj in curr_incident.keys():
                        obj_quant = curr_incident[obj]

                        # if the object is not in the start times dict, 
                        # add the second, multiplied by the quantity detected 
                        if not obj in incident_starts:
                            incident_starts[obj] = []
                            for i in range(obj_quant):
                                incident_starts[obj].append(second)

                        # otherwise, check if the quantity has changed from the preivous second
                        elif prev_incident != None:
                            prev_obj_quant = 0

                            # set quant to the read quantity
                            if obj in prev_incident:
                                prev_obj_quant = prev_incident[obj]
                            
                            # if this quantity is less than before, generate an incident with this as the end time
                            if obj_quant < prev_obj_quant:
                                for i in range(prev_obj_quant-obj_quant):
                                    # text_incidents.append(str(incident_starts[obj].pop())+" "+str(second)+" "+obj+" "+DIR_PATH+"/"+video)
                                    text_incidents.append(self.text_incidents_helper(incident_starts[obj].pop(), second, obj, video_path))
                            
                            # otherwise, add this start time to the stack
                            elif obj_quant > prev_obj_quant:
                                for i in range(obj_quant-prev_obj_quant):
                                    incident_starts[obj].append(second)
                    prev_incident = curr_incident
                
                # at the end of the video, generate incidents with the remaining start values
                for obj in incident_starts:
                    while incident_starts[obj]:
                        # text_incidents.append(str(incident_starts[obj].pop())+" "+str(second)+" "+obj+" "+DIR_PATH+"/"+video)
                        text_incidents.append(self.text_incidents_helper(incident_starts[obj].pop(), second, obj, video_path))

        return text_incidents
            
        # def add_incident(self, start_time, end_time, object_id, video_id)

date_videos = { "20210225":["1.mp4","2.mp4","3.mp4","4.mp4","5.mp4","6.mp4"],
                "20210226":["7.mp4","8.mp4","9.mp4","10.mp4","11.mp4","12.mp4"]}

ig = IncidentGenerator()

incidents = ig.gen_incidents()
# incidents = ig.gen_incidents("20210225", "3.mp4")

f = open("incidents.txt", "w")
for incident in incidents:
    f.write(incident)