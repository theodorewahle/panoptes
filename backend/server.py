"""
server.py

Backend flask server
"""
from threading import Thread
from flask import Flask, current_app
from flask_cors import CORS, cross_origin
from streaming.rtsp import RTSPStreamer
from incidents.ftp import fetch_todays_incidents
from api import api, db_helper
from routes import routes


class FlaskThread(Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.app = current_app._get_current_object()

    def run(self):
        with self.app.app_context():
            super().run()


# PanoptesFlaskApp
# Custom Flask app
class PanoptesFlaskApp(Flask):
    def run(self, host=None, port=None, debug=None, load_dotenv=True, **options):
        with self.app_context():
            self.config.from_object('config')  # configure flask server
            db_helper.initialize(self)

            streamer = RTSPStreamer(self.config['RTSP'])

            # register blueprint and dbhelper for api
            self.register_blueprint(api, url_prefix='/api')
            self.register_blueprint(routes)

            # Fetch the latest incidents from the camera's FTP server
            # FlaskThread(target=fetch_todays_incidents, args=(db_helper,)).start()
            # FlaskThread(target=streamer.launch_proxy_stream).start()

        super(PanoptesFlaskApp, self).run(host=host, port=port,
                                          debug=debug, load_dotenv=load_dotenv, **options)


# DO NOT CHANGE THIS NAME
# IT MUST BE NAMED "app" IN ORDER TO BE
# DETECTED BY AWS ELASTIC BEANSTALK
app = PanoptesFlaskApp(__name__, static_url_path='')
cors = CORS(app)

@app.route('/')
def main():
    return 'Hello, World!'


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)