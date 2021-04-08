"""
database.py

Contains definition for DatabaseHelper for helper methods for sqlAlchemy connection between flask and sql server for
endpoints to request from sqlserver.

"""
from . import models
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import CreateSchema
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from os import urandom
from hashlib import pbkdf2_hmac


class DatabaseHelper:
    # Init/Initialization:
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

    def teardown(self):
        self.db.session.remove()
        self.db.drop_all()

    # CRUD database helper methods called by server endpoints (Camera, Video, Incident, Object, Object Set)
    # Camera CRUD:
    def get_camera(self, camera_id=None, title=None, url=None, user_id=None):
        if camera_id is not None:
            return self.db.session.query(models.Camera).filter(models.Camera.camera_id == camera_id).order_by(
                models.Camera.camera_id.asc()).all()
        elif url is not None:
            return self.db.session.query(models.Camera).filter(models.Camera.url == url).order_by(
                models.Camera.camera_id.asc()).all()
        elif title is not None:
            return self.db.session.query(models.Camera).filter(models.Camera.title == title).order_by(
                models.Camera.camera_id.asc()).all()
        elif user_id is not None:
            return self.db.session.query(models.Camera).filter(models.Camera.user_id == user_id).order_by(
                models.Camera.camera_id.asc()).all()
        return self.db.session.query(models.Camera).order_by(models.Camera.camera_id.asc()).all()

    def add_camera(self, title, url, user_id):
        camera = models.Camera(title=title, url=url, user_id=user_id)
        try:
            self.db.session.add(camera)
            self.db.session.commit()
            return camera
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def update_camera(self, camera_id, title=None, url=None, user_id=None):
        camera = self.db.session.query(models.Camera).filter(
            models.Camera.camera_id == camera_id).first()

        if camera is None:
            return camera

        try:
            if title is not None:
                camera.title = title
            if url is not None:
                camera.url = url
            if user_id is not None:
                camera.user_id = user_id
            self.db.session.commit()
            return camera
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def delete_camera(self, camera_id=None, title=None, url=None, user_id=None):
        if camera_id is not None:
            self.db.session.query(models.Camera).filter(
                models.Camera.camera_id == camera_id).delete()
        elif title is not None:
            self.db.session.query(models.Camera).filter(
                models.Camera.title == title).delete()
        elif url is not None:
            self.db.session.query(models.Camera).filter(
                models.Camera.url == url).delete()
        elif user_id is not None:
            self.db.session.query(models.Camera).filter(
                models.Camera.user_id == user_id).delete()
        self.db.session.commit()

    # Video CRUD:
    def get_video(self, video_id=None, file_path=None, camera_id=None):
        if video_id is not None:
            return self.db.session.query(models.Video).filter(models.Video.video_id == video_id).order_by(
                models.Video.video_id.asc()).all()
        elif file_path is not None:
            return self.db.session.query(models.Video).filter(models.Video.file_path == file_path).order_by(
                models.Video.video_id.asc()).all()
        elif camera_id is not None:
            return self.db.session.query(models.Video).filter(models.Video.camera_id == camera_id).order_by(
                models.Video.video_id.asc()).all()
        return self.db.session.query(models.Video).order_by(models.Video.video_id.asc()).all()

    def add_video(self, file_path, camera_id, timestamp=None):
        video = models.Video(file_path=file_path, timestamp=timestamp, camera_id=camera_id)
        try:
            self.db.session.add(video)
            self.db.session.commit()
            return video
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def update_video(self, video_id, file_path=None, timestamp=None, camera_id=None):
        video = self.db.session.query(models.Video).filter(
            models.Video.video_id == video_id).first()

        if video is None:
            return None

        try:
            if file_path is not None:
                video.file_path = file_path
            if timestamp is not None:
                video.timestamp = timestamp
            if camera_id is not None:
                video.camera_id = camera_id
            self.db.session.commit()
            return video
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def delete_video(self, video_id=None, file_path=None, timestamp=None, camera_id=None):
        if video_id is not None:
            self.db.session.query(models.Video).filter(
                models.Video.video_id == video_id).delete()
        elif file_path is not None:
            self.db.session.query(models.Video).filter(
                models.Video.file_path == file_path).delete()
        elif file_path is not None:
            self.db.session.query(models.Video).filter(
                models.Video.timestamp == timestamp).delete()
        elif camera_id is not None:
            self.db.session.query(models.Video).filter(
                models.Video.camera_id == camera_id).delete()
        self.db.session.commit()

    # Incident CRUD:
    def get_incident(self, incident_id=None, timestamp=None, object_id=None, video_id=None):
        if incident_id is not None:
            return self.db.session.query(models.Incident) \
                .filter(models.Incident.incident_id == incident_id).order_by(models.Incident.incident_id.asc()).all()
        if timestamp is not None:
            return self.db.session.query(models.Incident).filter(models.Incident.timestamp == timestamp).order_by(
                models.Incident.incident_id.asc()).all()
        elif object_id is not None and video_id is not None:
            return self.db.session.query(models.Incident) \
                .filter(models.Incident.object_id == object_id, models.Incident.video_id == video_id).order_by(
                models.Incident.incident_id.asc()).all()
        elif object_id is not None:
            return self.db.session.query(models.Incident).filter(models.Incident.object_id == object_id).order_by(
                models.Incident.incident_id.asc()).all()
        elif video_id is not None:
            return self.db.session.query(models.Incident).filter(models.Incident.video_id == video_id).order_by(
                models.Incident.incident_id.asc()).all()
        return self.db.session.query(models.Incident).order_by(models.Incident.incident_id.asc()).all()

    def get_incident_with_object(self, incident_id=None, object_id=None, video_id=None):
        if incident_id is not None:
            return self.db.session.query(models.Incident, models.Object) \
                .join(models.Object).filter(models.Incident.incident_id == incident_id).order_by(
                models.Incident.incident_id.asc()).all()
        if object_id is not None and video_id is not None:
            return self.db.session.query(models.Incident, models.Object) \
                .join(models.Object).filter(models.Incident.object_id == object_id, models.Incident.video_id == video_id).order_by(
                models.Incident.incident_id.asc()).all()
        elif object_id is not None:
            return self.db.session.query(models.Incident, models.Object) \
                .join(models.Object).filter(models.Incident.object_id == object_id).order_by(
                models.Incident.incident_id.asc()).all()
        elif video_id is not None:
            return self.db.session.query(models.Incident, models.Object) \
                .join(models.Object).filter(models.Incident.video_id == video_id).order_by(
                models.Incident.incident_id.asc()).all()
        return self.db.session.query(models.Incident, models.Object).join(models.Object).order_by(
            models.Incident.incident_id.asc()).all()

    def get_incidents_by_camera_id(self, camera_id):
        return self.db.session.query(models.Incident, models.Object) \
            .join(models.Object) \
                .join(models.Video) \
            .join(models.Camera) \
            .filter(models.Camera.camera_id == camera_id) \
            .all()

    def get_incident_by_object_name(self, object_name):
        return self.db.session.query(models.Incident) \
            .join(models.Object) \
                .filter(models.Object.name == object_name) \
                    .all()

    def search_incident(self, object_name):
        if object_name is None:
            return self.get_incident_with_object()
        else:
            search = "%{}%".format(object_name)
            return self.db.session.query(models.Incident, models.Object) \
                .join(models.Object) \
                    .filter(models.Object.name.like(search)) \
                        .all()

    def add_incident(self, start_time, end_time, object_id, video_id, timestamp=None):
        incident = models.Incident(
            start_time=start_time, end_time=end_time, timestamp=timestamp, object_id=object_id, video_id=video_id)
        try:
            self.db.session.add(incident)
            self.db.session.commit()
            return incident
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def update_incident(self, incident_id, object_id=None, video_id=None, start_time=None, end_time=None, timestamp=None):
        incident = self.db.session.query(models.Incident).filter(
            models.Incident.incident_id == incident_id).first()

        if incident is None:
            return None

        try:
            if object_id is not None:
                incident.object_id = object_id
            if video_id is not None:
                incident.video_id = video_id
            if start_time is not None:
                incident.start_time = start_time
            if end_time is not None:
                incident.end_time = end_time
            if timestamp is not None:
                incident.timestamp = timestamp
            self.db.session.commit()
            return incident
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def delete_incident(self, incident_id=None, timestamp=None, object_id=None, video_id=None):
        if incident_id is not None:
            self.db.session.query(models.Incident) \
                .filter(models.Incident.incident_id == incident_id).delete()
        if timestamp is not None:
            self.db.session.query(models.Incident) \
                .filter(models.Incident.timestamp == timestamp).delete()
        elif object_id is not None and video_id is not None:
            self.db.session.query(models.Incident) \
                .filter(models.Incident.object_id == object_id,
                        models.Incident.video_id == video_id).delete()
        elif object_id is not None and video_id is not None:
            self.db.session.query(models.Incident) \
                .filter(models.Incident.object_id == object_id, models.Incident.video_id == video_id).delete()
        elif object_id is not None:
            self.db.session.query(models.Incident).filter(
                models.Incident.object_id == object_id).delete()
        elif video_id is not None:
            self.db.session.query(models.Incident).filter(
                models.Incident.video_id == video_id).delete()
        self.db.session.commit()

    # Object CRUD:
    def get_object(self, object_id=None, name=None, object_set_id=None):
        if object_id is not None:
            return self.db.session.query(models.Object).filter(models.Object.object_id == object_id).order_by(
                models.Object.object_id.asc()).all()
        elif name is not None:
            return self.db.session.query(models.Object).filter(models.Object.name == name).order_by(
                models.Object.object_id.asc()).all()
        elif object_set_id is not None:
            return self.db.session.query(models.Object).filter(models.Object.object_set_id == object_set_id).order_by(
                models.Object.object_id.asc()).all()
        return self.db.session.query(models.Object).order_by(models.Object.object_id.asc()).all()

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
        object = self.db.session.query(models.Object).filter(
            models.Object.object_id == object_id).first()

        if object is None:
            return None
        
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
            self.db.session.query(models.Object).filter(
                models.Object.object_id == object_id).delete()
        elif name is not None:
            self.db.session.query(models.Object).filter(
                models.Object.name == name).delete()
        elif object_set_id is not None:
            self.db.session.query(models.Object).filter(
                models.Object.object_set_id == object_set_id).delete()
        self.db.session.commit()

    # Object set CRUD:
    def get_object_set(self, object_set_id=None, name=None):
        if object_set_id is not None:
            return self.db.session.query(models.ObjectSet).filter(models.ObjectSet.object_set_id == object_set_id).order_by(
                models.ObjectSet.object_set_id.asc()).all()
        elif name is not None:
            return self.db.session.query(models.ObjectSet).filter(models.ObjectSet.name == name).order_by(
                models.ObjectSet.object_set_id.asc()).all()
        return self.db.session.query(models.ObjectSet).order_by(models.ObjectSet.object_set_id.asc()).all()

    def get_object_sets_and_objects(self):
        return self.db.session.query(models.ObjectSet, models.Object).join(models.Object).order_by(
            models.ObjectSet.object_set_id.asc()).all()

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
        object_set = self.db.session.query(models.ObjectSet).filter(
            models.ObjectSet.object_set_id == object_set_id).first()

        if object_set is None:
            return None

        try:
            object_set.name = name
            self.db.session.commit()
            return object_set
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def delete_object_set(self, object_set_id=None, name=None):
        if object_set_id is not None:
            self.db.session.query(models.ObjectSet).filter(
                models.ObjectSet.object_set_id == object_set_id).delete()
        elif name is not None:
            self.db.session.query(models.ObjectSet).filter(
                models.ObjectSet.name == name).delete()
        self.db.session.commit()

    # Users CRUD:
    def get_user(self, user_id=None, username=None):
        if user_id is not None:
            return self.db.session.query(models.User).filter(models.User.user_id == user_id).order_by(
                models.User.user_id.asc()).all()
        elif username is not None:
            return self.db.session.query(models.User).filter(models.User.username == username).order_by(
                models.User.username.asc()).all()
        return self.db.session.query(models.User).order_by(models.User.user_id.asc()).all()

    def add_user(self, username, password):

        # need to salt the password and store the salt and hash
        salt, hash = self.create_hash(password)

        user = models.User(username=username, salt=salt, hash=hash)
        try:
            self.db.session.add(user)
            self.db.session.commit()
            return user
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def update_user(self, user_id, username=None, password=None):
        user = self.db.session.query(models.User).filter(
            models.User.user_id == user_id).first()

        if user is None:
            return user

        try:
            if username is not None:
                user.username = username
            if password is not None:
                salt, hash = self.create_hash(password)
                user.salt = salt
                user.hash = hash
            self.db.session.commit()
            return user
        except SQLAlchemyError as e:
            self.db.session.rollback()
            return e

    def delete_user(self, user_id=None, username=None):
        if user_id is not None:
            self.db.session.query(models.User).filter(
                models.User.user_id == user_id).delete()
        elif username is not None:
            self.db.session.query(models.User).filter(
                models.User.username == username).delete()
        self.db.session.commit()

    def create_hash(password):
        salt = urandom(64)
        hash = pbkdf2_hmac('sha512', password.encode(), salt.encode(), 100000)
        return salt, hash