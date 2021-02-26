import threading

from flask import Flask, Response, render_template, send_from_directory

from streaming.live_streaming import generate
from streaming.static import generate_static
from streaming.rtsp import RTSPStreamer

from computer_vision.hog_detection import HOGDetectionModel
from incidents.ftp import fetch_todays_incidents
from api import api, db_helper

def create_app():
    # DO NOT CHANGE THIS NAME
    # IT MUST BE NAMED "application" IN ORDER TO BE
    # DETECTED BY AWS ELASTIC BEANSTALK
    application = Flask(__name__, static_url_path='')
    application.config.from_object('config')  # configure flask server
    streamer = RTSPStreamer(application.config['RTSP'])
    
    # register blueprint and dbhelper for api
    application.register_blueprint(api, url_prefix='/api')
    db_helper.initialize(application)

    if __name__ == '__main__':
        # Fetch the latest incidents from the camera's FTP server
        fetch_incidents_thread = threading.Thread(target=fetch_todays_incidents)
        rtsp_stream_proxy_server_thread = threading.Thread(target=streamer.launch_proxy_stream)

        fetch_incidents_thread.start()
        rtsp_stream_proxy_server_thread.start()

        host = "127.0.0.1"
        port = 8000
        debug = False
        options = None
        application.run(host, port, debug, options)
    
    return application

application = create_app()

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


@application.route('/incident/<video_id>')
def send_static_file(video_id):
    # Example: http://127.0.0.1:8000/incident/20210218/A210218_003304_003318.mp4
    result = db_helper.get_video(video_id=video_id)
    return send_from_directory('incidents/converted', result.file_path)
