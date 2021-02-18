from flask import Flask, Response, render_template, jsonify, request

from streaming.live_streaming import generate
from streaming.static import generate_static
from computer_vision.hog_detection import HOGDetectionModel
from database.database import DatabaseHelper
from utils.utils import *

# DO NOT CHANGE THIS NAME
# IT MUST BE NAMED "application" IN ORDER TO BE 
# DETECTED BY AWS ELASTIC BEANSTALK
application = Flask(__name__)
application.config.from_object('config')  # configure flask server
db_helper = DatabaseHelper(application)  # initialize database helper

@application.route('/stream', methods = ['GET'])
def stream():
    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

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

@application.route('/api/cameras', methods=['GET'])
def api_cameras():
    return list_to_json(db_helper.get_all_cameras())


if __name__ == '__main__':
   host = "127.0.0.1"
   port = 8000
   debug = False
   options = None
   application.run(host, port, debug, options)
