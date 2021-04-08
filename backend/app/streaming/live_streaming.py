import threading
import cv2 as cv

# Parts of this code are adapted from this project:
# https://github.com/nickdehart/flask-react-streaming

# we need to have a lock to ensure 
# thread-safety when streaming to multiple tabs
lock = threading.Lock()

def generate():
   global lock

   vc = cv.VideoCapture(0) # input 0 is the webcam
   if vc.isOpened():
      streaming, next_frame = vc.read()
   else:
      streaming = False

   while streaming:
      with lock:
         streaming, next_frame = vc.read()

         if next_frame is None:
            continue

         # encode the frame as JPEG
         (flag, encodedImage) = cv.imencode(".jpg", next_frame)

         # ensure the frame was successfully encoded
         if not flag:
            continue

      yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

   vc.release()
    