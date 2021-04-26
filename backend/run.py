"""
run.py

Backend flask server
"""
from threading import Thread
from flask import Flask, current_app
from flask_cors import CORS, cross_origin
from app.streaming.rtsp import RTSPStreamer
from app.incidents.ftp import fetch_todays_incidents
from app.api.api import api, db_helper
from app.routes.routes import routes
import sys

app_settings = 'config.ProductionConfig'

class FlaskThread(Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.app = current_app._get_current_object()

    def run(self):
        with self.app.app_context():
            super().run()


# PanoptesFlaskApp
# Custom Flask application
class PanoptesFlaskApp(Flask):

    def run(self, **options):
        with self.app_context():
            self.config.from_object(app_settings)  # configure flask server
            db_helper.initialize(self)

            streamer = RTSPStreamer(self.config['RTSP'])

            # register blueprint and dbhelper for api
            self.register_blueprint(api, url_prefix='/api')
            self.register_blueprint(routes)

            # Fetch the latest incidents from the camera's FTP server
            FlaskThread(target=fetch_todays_incidents, args=(db_helper,)).start()
            FlaskThread(target=streamer.launch_proxy_stream).start()

        super(PanoptesFlaskApp, self).run(host=self.config['HOST'], port=self.config['PORT'],
                                          debug=self.config['DEBUG'], load_dotenv=self.config['LOAD_DOTENV'], **options)


# DO NOT CHANGE THIS NAME
# IT MUST BE NAMED "application" IN ORDER TO BE
# DETECTED BY AWS ELASTIC BEANSTALK
application = PanoptesFlaskApp(__name__, static_url_path='')
cors = CORS(application)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == 'test':
            app_settings = 'config.TestingConfig'
    application.run()
