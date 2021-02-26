from database.database import DatabaseHelper
# from computer_vision.incident_generator import IncidentGenerator
import os

class_names = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
        'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
        'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
        'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
        'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
        'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
        'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 
        'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 
        'teddy bear', 'hair drier', 'toothbrush']

date_videos = {"20210225":["1.mp4","1.mp4","1.mp4","1.mp4","1.mp4","1.mp4"],
        "20210225":["7.mp4","8.mp4","9.mp4","10.mp4","11.mp4","12.mp4"]}

object_set_id = None
object_ids = dict()
date_video_ids = dict()
camera_id = None
PATH = os.path.dirname(os.path.realpath(__file__))+"/incidents/converted"

DH = DatabaseHelper()

def populate_db():
        object_set_id = DH.add_object_set("YOLO classes")
        for class_name in class_names:
                object_ids[class_name] = DH.add_object(class_name, object_set_id)
        camera_id = add_camera("temp")
        for date in date_videos.keys():
                date_video_ids[date] = dict()
                for video in date_videos[date]:
                        vid_path = os.path.join(PATH, date, video)
                        date_video_ids[video] = DH.add_video(vid_path, camera_id)

def rm_db():
        for id in object_ids.values():
                DH.delete_object(ids)
        DH.delete_object_set(object_set_id, "YOLO classes")
        for date in date_videos_ids.keys():
                for video in date_videos_ids[date]:
                        DH.delete_video(date_videos_ids[date][video])
        DH.delete_camera(camera_id)
