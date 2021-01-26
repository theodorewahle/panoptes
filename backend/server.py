from flask import Flask, Response, render_template

from streaming.live_streaming import generate
from streaming.static import generate_static

app = Flask(__name__)

@app.route('/stream', methods = ['GET'])
def stream():
    return Response(generate(), mimetype = "multipart/x-mixed-replace; boundary=frame")

@app.route('/static', methods = ['GET'])
def static_stream():
    return Response(generate_static(), mimetype="multipart/x-mixed-replace; boundary=frame")

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
   host = "127.0.0.1"
   port = 8000
   debug = False
   options = None
   app.run(host, port, debug, options)