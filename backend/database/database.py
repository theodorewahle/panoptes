from models import Camera, Base
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

class DatabaseHelper():

    def __init__(self, app):
        self.app = app;
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:password@localhost/panoptes'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.db = SQLAlchemy(self.app, model_class=Base)
        self.db.create_all()

    def list_tables(self):
        return self.db.engine.table_names()

    def add_camera(self, url):
        self.db.session.add(Camera(url=url))
        self.db.session.commit()

    def get_all_cameras(self):
        return self.db.session.query(Camera).all()


        
database_helper = DatabaseHelper(Flask(__name__))
print(database_helper.list_tables())
for camera in database_helper.get_all_cameras():
    print(str(camera.camera_id) + " " + camera.url)