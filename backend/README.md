# Backend

Uses flask and openCV to stream video for Panoptes backend

# Flask

Flask is a lightweight WSGI web application framework. It is designed to make getting started quick and easy, with the ability to scale up to complex applications. It began as a simple wrapper around Werkzeug and Jinja and has become one of the most popular Python web application frameworks.
Flask is being used in conjunction with openCV to run the Panoptes backend where video is being streamed.

# Livestream/static stream
Current functionality involves demonstration of video streaming capabilities on flask server at server.py, shows both 
livestream from local webcam and streaming videos from a video directory /static_videos

# Running

Must have flask and python installed, to run first export flask application (export FLASK_APP=server.py) and then
run the application (flask run). 

```
$ cd panoptes/backend
$ pip3 install -r requirements.txt
$ python3 server.py
```
 
 Go to http://127.0.0.1:5000 in a browser to see application running locally
 
# TODO

Connect to webcam hardware
