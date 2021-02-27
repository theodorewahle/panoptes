"""
server.py

Backend flask server
"""
from threading import Thread
from flask import Flask, Response, render_template, send_from_directory, current_app
from streaming.rtsp import RTSPStreamer
from incidents.ftp import fetch_todays_incidents
from api import api, db_helper
from routes import routes




# FetchIncidentsThread
# Custom Thread class for taking db_helper into thread with app.context
class FetchIncidentsThread(Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.app = current_app._get_current_object()
        self.db_helper = args[0]

    def run(self):
        with self.app.app_context():
            fetch_todays_incidents(self.args[0])

# ProxyStreamThread
# Custom Thread class for taking db_helper into thread with app.context
class ProxyStreamThread(Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.app = current_app._get_current_object()
        self.args = args

    def run(self):
        with self.app.app_context():
            self.args[1].launch_proxy_stream(self.args[0])

# PanoptesFlaskApp
# Custom Flask application
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
            FetchIncidentsThread(target=fetch_todays_incidents, args=(db_helper,)).start()
            ProxyStreamThread(target=streamer.launch_proxy_stream, args=(db_helper, streamer,)).start()

        super(PanoptesFlaskApp, self).run(host=host, port=port, debug=debug, load_dotenv=load_dotenv, **options)


# DO NOT CHANGE THIS NAME
# IT MUST BE NAMED "application" IN ORDER TO BE
# DETECTED BY AWS ELASTIC BEANSTALK
application = PanoptesFlaskApp(__name__, static_url_path='')

if __name__ == '__main__':
    host = "127.0.0.1"
    port = 8000
    debug = False
    options = None
    application.run(host, port, debug, options)
