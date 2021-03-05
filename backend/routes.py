"""
routes.py

Blueprint for routes for backend, actualized by flask server in server.py
"""
from flask import Blueprint
from flask.globals import request
from utils.utils import *
from flask import Response, render_template, send_from_directory
from computer_vision.hog_detection import HOGDetectionModel
from streaming.live_streaming import generate
from streaming.static import generate_static
from api import db_helper

routes = Blueprint('routes', __name__)

@routes.route('/stream', methods=['GET'])
def stream():
    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")


@routes.route('/static', methods=['GET'])
def static_stream():
    return Response(generate_static(), mimetype="multipart/x-mixed-replace; boundary=frame")


@routes.route('/vision', methods=['GET'])
def cv_stream():
    detector = HOGDetectionModel()
    return Response(detector.detect("./usain_bolt.mp4"), mimetype="multipart/x-mixed-replace; boundary=frame")


@routes.route('/')
def index():
    return render_template('index.html')


@routes.route('/ping')
def ping():
    return "pong"


@routes.route('/video/<video_id>')
def send_static_file(video_id):
    result = db_helper.get_video(video_id=video_id)
    if len(result) != 1:
        abort(404)
    else:
        return send_from_directory('incidents/converted', result[0].file_path)
