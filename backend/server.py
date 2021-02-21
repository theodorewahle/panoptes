from flask import Flask, Response, render_template, request, abort

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


@application.route('/stream', methods=['GET'])
def stream():
    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")


@application.route('/static', methods=['GET'])
def static_stream():
    return Response(generate_static(), mimetype="multipart/x-mixed-replace; boundary=frame")


@application.route('/vision', methods=['GET'])
def cv_stream():
    detector = HOGDetectionModel()
    return Response(detector.detect("./usain_bolt.mp4"), mimetype="multipart/x-mixed-replace; boundary=frame")


@application.route('/')
def index():
    return render_template('index.html')


@application.route('/ping')
def ping():
    return "pong"


@application.route('/api/cameras', methods=['GET', 'POST'])
def cameras():
    if request.method == 'GET':
        return jsonify_result(db_helper.get_camera())
    elif request.method == 'POST':
        if check_body(request, 'url'):
            url = request.get_json()['url']
            response = unwrap_db_result(db_helper.add_camera(url))
            response.status_code = 201;
            return response
        abort(400)


@application.route('/api/incidents', methods=['GET'])
def incidents():
    camera_id = request.args.get('camera_id')
    if camera_id is not None:
        return jsonify_result(db_helper.get_incidents_by_camera_id(camera_id))
    else:
        return jsonify_result(db_helper.get_incident())

@application.route('/api/object_set', methods=['GET', 'POST'])
def object_set():
    if request.method == 'GET':
        return jsonify_result(db_helper.get_object_set())
    elif request.method == 'POST':
        if check_body(request, 'name'):
            name = request.get_json()['name']
            response = unwrap_db_result(db_helper.add_object_set(name))
            response.status_code = 201;
            return response
        abort(400)

@application.route('/api/object', methods=['GET', 'POST'])
def objects():
    if request.method == 'GET':
        return jsonify_result(db_helper.get_object())
    elif request.method == 'POST':
        if check_body(request, 'name', 'object_set_id'):
            name = request.get_json()['name']
            object_set_id = request.get_json()['object_set_id']
            response = unwrap_db_result(db_helper.add_object(name, object_set_id))
            response.status_code = 201;
            return response
        abort(400)

@application.route('/api/videos', methods=['GET', 'POST'])
def videos():
    if request.method == 'GET':
        return jsonify_result(db_helper.get_video())
    elif request.method == 'POST':
        if check_body(request, 'file_path', 'camera_id'):
            file_path = request.get_json()['file_path']
            camera_id = request.get_json()['camera_id']
            response = unwrap_db_result(db_helper.add_video(file_path, camera_id))
            response.status_code = 201;
            return response
        abort(400)


if __name__ == '__main__':
    host = "127.0.0.1"
    port = 8000
    debug = False
    options = None
    application.run(host, port, debug, options)
