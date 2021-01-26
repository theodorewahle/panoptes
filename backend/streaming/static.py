import cv2
import threading
import os

lock = threading.Lock()  # lock handles multiple tabs

def generate_static():
    global lock
    static_video_dir = 'static_videos/'

    for filename in os.listdir(static_video_dir):  # loops through all videos in static_video_dir
        print(filename)
        camera = cv2.VideoCapture(static_video_dir + filename)
        if camera.isOpened():
            streaming, next_frame = camera.read()
        else:
            streaming = False

        while streaming:
            with lock:
                streaming, frame = camera.read()  # read the camera frame

                if not streaming or cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                else:
                    ret, buffer = cv2.imencode('.jpg', frame)
                    frame = buffer.tobytes()
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result
        camera.release()
