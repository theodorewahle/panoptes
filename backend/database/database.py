"""
database.py

Contains definition for DatabaseHelper for helper methods for sqlAlchemy connection between flask and sql server
"""

import sqlalchemy
from sqlalchemy.sql.functions import mode
from . import models
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import CreateSchema
from sqlalchemy import create_engine, text


class DatabaseHelper():

    def __init__(self, app):

        # attempt to create schema if it doesn't exist
        engine = create_engine(app.config['SQL_URL'])
        try:
            engine.execute(CreateSchema(app.config['SCHEMA_NAME']))
        except:
            print(app.config['SCHEMA_NAME'] + " already exists.")

        # set up database and create tables
        self.db = SQLAlchemy(app, model_class=models.Base)
        self.db.create_all()

    def get_all_cameras(self):
        return self.db.session.query(models.Camera).all()

    def add_camera(self, url):
        camera = models.Camera(url=url)
        try:
            self.db.session.add(camera)
            self.db.session.commit()
            return camera
        except sqlalchemy.exc.IntegrityError:
            return None

    def get_all_videos(self):
        return self.db.session.query(models.Video).all()

    def add_video(self, file_path, camera_id):
        video = models.Video(file_path=file_path, camera_id=camera_id)
        self.db.session.add(video)
        self.db.session.commit()
        return video

    def get_all_incidents(self):
        return self.db.session.query(models.Incident).all()

    def get_incidents_by_camera_id(self, camera_id):
        return self.db.session.query(models.Incident) \
            .join(models.Video) \
                .join(models.Camera) \
                    .filter(models.Camera.camera_id == camera_id) \
                        .all()

    def add_incident(self, start_time, end_time, object_id, video_id):
        incident = models.Video(start_time=start_time, end_time=end_time, object_id=object_id, video_id=video_id)
        self.db.session.add(incident)
        self.db.session.commit()
        return incident

    def get_all_objects(self):
        return self.db.session.query(models.Object).all()

    def add_object(self, name, object_set_id):
        object = models.Object(name=name, object_set_id=object_set_id)
        self.db.session.add(object)
        self.db.session.commit()
        return object

    def get_all_object_sets(self):
        return self.db.session.query(models.ObjectSet).all()

    def add_object_set(self, name):
        object_set = models.ObjectSet(name=name)
        self.db.session.add(object_set)
        self.db.session.commit()
        return object_set