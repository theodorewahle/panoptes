from flask import Flask, Response, render_template, send_from_directory

from streaming.live_streaming import generate
from streaming.static import generate_static
from computer_vision.hog_detection import HOGDetectionModel
from incidents.ftp import fetch_todays_incidents

# DO NOT CHANGE THIS NAME
# IT MUST BE NAMED "application" IN ORDER TO BE 
# DETECTED BY AWS ELASTIC BEANSTALK
application = Flask(__name__, static_url_path='')

@application.route('/stream', methods = ['GET'])
def stream():
    return Response(generate(), mimetype = "multipart/x-mixed-replace; boundary=frame")

@application.route('/static', methods = ['GET'])
def static_stream():
    return Response(generate_static(), mimetype="multipart/x-mixed-replace; boundary=frame")

@application.route('/vision', methods = ['GET'])
def cv_stream():
    detector = HOGDetectionModel()
    return Response(detector.detect("./usain_bolt.mp4"), mimetype="multipart/x-mixed-replace; boundary=frame")

@application.route('/')
def index():
    return render_template('index.html')

@application.route('/ping')
def ping():
    return "pong"

@application.route('/incident/<path:path>')
def send_static_file(path):
    # Example: http://127.0.0.1:8000/incident/20210218/A210218_003304_003318.mp4
    return send_from_directory('incidents/converted', path)

if __name__ == '__main__':
    # Fetch the latest incidents from the camera's FTP server
    fetch_todays_incidents()
    
    host = "127.0.0.1"
    port = 8000
    debug = False
    options = None
    application.run(host, port, debug, options)
