"""
database.py

Contains definition for DatabaseHelper for helper methods for sqlAlchemy connection between flask and sql server
"""

from . import models
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import CreateSchema
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError


class DatabaseHelper():

    def __init__(self):
        self.db = SQLAlchemy(model_class=models.Base)

    def initialize(self, app):
        # attempt to create schema if it doesn't exist
        engine = create_engine(app.config['SQL_URL'])
        try:
            engine.execute(CreateSchema(app.config['SCHEMA_NAME']))
        except:
            print(app.config['SCHEMA_NAME'] + " already exists.")

        # set up database and create tables
        self.db.init_app(app)
        with app.app_context():
            self.db.create_all()

    def get_camera(self, camera_id=None, url=None):
        if camera_id is not None:
            return self.db.session.query(models.Camera).filter(models.Camera.camera_id == camera_id).all()
        elif url is not None:
            return self.db.session.query(models.Camera).filter(models.Camera.url == url).all()
        return self.db.session.query(models.Camera).all()

    def add_camera(self, url):
        camera = models.Camera(url=url)
        try:
            self.db.session.add(camera)
            self.db.session.commit()
            return camera
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def update_camera(self, camera_id, url):
        camera = self.db.session.query(models.Camera).filter(models.Camera.camera_id == camera_id).first()
        try:
            camera.url = url
            self.db.session.commit()
            return camera
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def delete_camera(self, camera_id=None, url=None):
        if camera_id is not None:
            self.db.session.query(models.Camera).filter(models.Camera.camera_id == camera_id).delete()
        elif url is not None:
            self.db.session.query(models.Camera).filter(models.Camera.url == url).delete()
        self.db.session.commit()

    def get_video(self, video_id=None, file_path=None, camera_id=None):
        if video_id is not None:
            return self.db.session.query(models.Video).filter(models.Video.video_id == video_id).all()
        elif file_path is not None:
            return self.db.session.query(models.Video).filter(models.Video.file_path == file_path).all()
        elif camera_id is not None:
            return self.db.session.query(models.Video).filter(models.Video.camera_id == camera_id).all()
        return self.db.session.query(models.Video).all()

    def add_video(self, file_path, camera_id):
        video = models.Video(file_path=file_path, camera_id=camera_id)
        try:
            self.db.session.add(video)
            self.db.session.commit()
            return video
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def update_video(self, video_id, file_path=None, camera_id=None):
        video = self.db.session.query(models.Video).filter(models.Video.video_id == video_id).first()
        try:
            if file_path is not None:
                video.file_path = file_path
            if camera_id is not None:
                video.camera_id = camera_id     
            self.db.session.commit()
            return video
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def delete_video(self, video_id=None, file_path=None, camera_id=None):
        if video_id is not None:
            self.db.session.query(models.Video).filter(models.Video.video_id == video_id).delete()
        elif file_path is not None:
            self.db.session.query(models.Video).filter(models.Video.file_path == file_path).delete()
        elif camera_id is not None:
            self.db.session.query(models.Video).filter(models.Video.camera_id == camera_id).delete()
        self.db.session.commit()

    def get_incident(self, incident_id=None, object_id=None, video_id=None):
        if incident_id is not None:
            return self.db.session.query(models.Incident) \
                .filter(models.Incident.incident_id == incident_id).all()
        if object_id is not None and video_id is not None:
            return self.db.session.query(models.Incident) \
                .filter(models.Incident.object_id == object_id, models.Incident.video_id == video_id).all()
        elif object_id is not None:
            return self.db.session.query(models.Incident).filter(models.Incident.object_id == object_id).all()
        elif video_id is not None:
            return self.db.session.query(models.Incident).filter(models.Incident.video_id == video_id).all()
        return self.db.session.query(models.Incident).all()

    def get_incidents_by_camera_id(self, camera_id):
        return self.db.session.query(models.Incident) \
            .join(models.Video) \
                .join(models.Camera) \
                    .filter(models.Camera.camera_id == camera_id) \
                        .all()

    def add_incident(self, start_time, end_time, object_id, video_id):
        incident = models.Video(start_time=start_time, end_time=end_time, object_id=object_id, video_id=video_id)
        try:
            self.db.session.add(incident)
            self.db.session.commit()
            return incident
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def update_incident(self, incident_id, object_id=None, video_id=None, start_time=None, end_time=None):
        incident = self.db.session.query(models.Incident).filter(models.Incident.incident_id == incident_id).first()
        try:
            if object_id is not None:
                incident.object_id = object_id
            if video_id is not None:
                incident.video_id = video_id
            if start_time is not None:
                incident.start_time = start_time
            if end_time is not None:
                incident.end_time = end_time     
            self.db.session.commit()
            return incident
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def delete_incident(self, incident_id=None, object_id=None, video_id=None):
        if incident_id is not None:
            self.db.session.query(models.Incident) \
                .filter(models.Incident.incident_id == incident_id).delete()
        if object_id is not None and video_id is not None:
            self.db.session.query(models.Incident) \
                .filter(models.Incident.object_id == object_id, \
                    models.Incident.video_id == video_id).delete()
        elif object_id is not None and video_id is not None:
            self.db.session.query(models.Incident) \
                .filter(models.Incident.object_id == object_id, models.Incident.video_id == video_id).delete()
        elif object_id is not None:
            self.db.session.query(models.Incident).filter(models.Incident.object_id == object_id).delete()
        elif video_id is not None:
            self.db.session.query(models.Incident).filter(models.Incident.video_id == video_id).delete()
        self.db.session.commit()

    def get_object(self, object_id=None, name=None, object_set_id=None):
        if object_id is not None:
            return self.db.session.query(models.Object).filter(models.Object.object_id == object_id).all()
        elif name is not None:
            return self.db.session.query(models.Object).filter(models.Object.name == name).all()
        elif object_set_id is not None:
            return self.db.session.query(models.Object).filter(models.Object.object_set_id == object_set_id).all()
        return self.db.session.query(models.Object).all()

    def add_object(self, name, object_set_id):
        object = models.Object(name=name, object_set_id=object_set_id)
        try:
            self.db.session.add(object)
            self.db.session.commit()
            return object
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def update_object(self, object_id, name=None, object_set_id=None):
        object = self.db.session.query(models.Object).filter(models.Object.object_id == object_id).first()
        try:
            if name is not None:
                object.name = name
            if object_set_id is not None:
                object.object_set_id = object_set_id   
            self.db.session.commit()
            return object
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def delete_object(self, object_id=None, name=None, object_set_id=None):
        if object_id is not None:
            self.db.session.query(models.Object).filter(models.Object.object_id == object_id).delete()
        elif name is not None:
            self.db.session.query(models.Object).filter(models.Object.name == name).delete()
        elif object_set_id is not None:
            self.db.session.query(models.Object).filter(models.Object.object_set_id == object_set_id).delete()
        self.db.session.commit()

    def get_object_set(self, object_set_id=None, name=None):
        if object_set_id is not None:
            return self.db.session.query(models.ObjectSet).filter(models.ObjectSet.object_set_id == object_set_id).all()
        elif name is not None:
            return self.db.session.query(models.ObjectSet).filter(models.ObjectSet.name == name).all()
        return self.db.session.query(models.ObjectSet).all()

    def add_object_set(self, name):
        object_set = models.ObjectSet(name=name)
        try:
            self.db.session.add(object_set)
            self.db.session.commit()
            return object_set
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def update_object_set(self, object_set_id, name):
        object_set = self.db.session.query(models.ObjectSet).filter(models.ObjectSet.object_set_id == object_set_id).first()
        try:
            object_set.name = name 
            self.db.session.commit()
            return object_set
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def delete_object_set(self, object_set_id=None, name=None):
        if object_set_id is not None:
            self.db.session.query(models.ObjectSet).filter(models.ObjectSet.object_set_id == object_set_id).delete()
        elif name is not None:
            self.db.session.query(models.ObjectSet).filter(models.ObjectSet.name == name).delete()
        self.db.session.query(models.ObjectSet).commit()