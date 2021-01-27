from flask import Flask, Response, render_template

from streaming.live_streaming import generate
from streaming.static import generate_static

# DO NOT CHANGE THIS NAME
# IT MUST BE NAMED "application" IN ORDER TO BE 
# DETECTED BY AWS ELASTIC BEANSTALK
application = Flask(__name__)

@application.route('/stream', methods = ['GET'])
def stream():
    return Response(generate(), mimetype = "multipart/x-mixed-replace; boundary=frame")

@application.route('/static', methods = ['GET'])
def static_stream():
    return Response(generate_static(), mimetype="multipart/x-mixed-replace; boundary=frame")

@application.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
   host = "127.0.0.1"
   port = 8000
   debug = False
   options = None
   application.run(host, port, debug, options)
