import os

# dictionary of object sets to the objects
class_names = { 'people': ['person'],
                'vehicle': ['bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat'],
                'street scape': ['traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench'],
                'animals': ['bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe'],
                'accesories': ['backpack', 'umbrella', 'handbag', 'tie', 'suitcase'],
                'sports': ['frisbee','skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard','tennis racket'],
                'food': ['bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake'],
                'furniture and appliances': ['chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']}

# dictionary of date dict to the videos 
date_videos = { "20210225":["1.mp4","2.mp4","3.mp4","4.mp4","5.mp4","6.mp4"],
                "20210226":["7.mp4","8.mp4","9.mp4","10.mp4","11.mp4","12.mp4"]}

# dictionary of ids per object and vid
object_id = dict()
video_id = dict()

# outpute file for sql commands
f = open("sql_commands.txt", "w")

# initialize id counters at 1
set_counter = 1
obj_counter = 1
for object_set in class_names.keys():
        f.write("INSERT INTO object_sets(name) VALUES (\"" + object_set + "\");\n")
        for object_name in class_names[object_set]:
                f.write("INSERT INTO objects(name, object_set_id) VALUES (\""+ object_name +"\", "+str(set_counter)+");\n")
                object_id[object_name] = obj_counter
                obj_counter += 1
        set_counter += 1

# write in example cameras
f.write("INSERT INTO cameras(url, title) VALUES (\"test camera url 1\", \"test camera title 1\");\n")
f.write("INSERT INTO cameras(url, title) VALUES (\"test camera url 2\", \"test camera title 2\");\n")

# get path to the converted videos 
PATH = os.path.dirname(os.path.realpath(__file__))+"/incidents/converted"

# generate video commads
vid_counter = 1
for date in date_videos.keys():
        date_path = PATH+"/"+date+"/"
        for video in date_videos[date]:
                curr_path = date_path + video
                f.write("INSERT INTO videos(file_path, camera_id) VALUES (\"" + curr_path + "\", "+str(int(vid_counter%2+1))+");\n")
                video_id[curr_path] = vid_counter
                vid_counter+=1

# open this file to read incidents for generation
try:
        incidents = open("incidents.txt")

        # read in incidents and generate insert commands
        for incident in incidents:
                incident = incident.split(" ")
                start_time = str(incident[0])
                end_time = str(incident[1])
                obj_id =  str(object_id[" ".join(incident[2:-1])])
                vid_id = str(video_id[incident[-1][:-1]])
                f.write("INSERT INTO incidents(start_time, end_time, object_id, video_id) VALUES ("+start_time+", "+end_time+", "+obj_id+", "+vid_id+");\n")
except:
        print("ERROR: Incidents cannot be generate. Issue with the incidents.txt file. (Make sure to run incident_generator.py first)")