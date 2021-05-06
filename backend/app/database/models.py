from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BLOB, DateTime

# this file represents all the tables in the database and is used by SQL Alchemy

Base = declarative_base()
metadata = Base.metadata


class Camera(Base):
    __tablename__ = 'cameras'

    camera_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    title = Column(String(100), unique=True)
    url = Column(String(100), unique=True)

    user_id = Column(ForeignKey('users.user_id', ondelete='CASCADE',
                                  onupdate='CASCADE'), nullable=False, index=True)

    user = relationship(
        'User', primaryjoin='Camera.user_id == User.user_id', backref='cameras')

    def serialize(self):
        return {'camera_id': self.camera_id,
        'title': self.title, 
        'url': self.url,
        'user_id': self.user_id}


class Incident(Base):
    __tablename__ = 'incidents'

    incident_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    start_time = Column(Integer, nullable=False)
    end_time = Column(Integer, nullable=False)
    timestamp = Column(DateTime)
    thumbnail_file_path = Column(String(100), nullable=False, unique=True)
    object_id = Column(ForeignKey('objects.object_id', ondelete='CASCADE',
                                  onupdate='CASCADE'), nullable=False, index=True)
    video_id = Column(ForeignKey('videos.video_id', ondelete='CASCADE',
                                 onupdate='CASCADE'), nullable=False, index=True)

    object = relationship(
        'Object', primaryjoin='Incident.object_id == Object.object_id', backref='incidents')
    video = relationship(
        'Video', primaryjoin='Incident.video_id == Video.video_id', backref='incidents')

    def serialize(self):
        return {'incident_id': self.incident_id,
        'start_time': self.start_time,
        'end_time': self.end_time,
        'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        'object_id': self.object_id,
        'video_id': self.video_id}


class ObjectSet(Base):
    __tablename__ = 'object_sets'

    object_set_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String(45), nullable=False, unique=True)

    def serialize(self):
        return {'object_set_id': self.object_set_id, 
        'name': self.name}


class Object(Base):
    __tablename__ = 'objects'

    object_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String(45), nullable=False, unique=True)
    object_set_id = Column(ForeignKey(
        'object_sets.object_set_id', ondelete='CASCADE', onupdate='CASCADE'), index=True)

    object_set = relationship(
        'ObjectSet', primaryjoin='Object.object_set_id == ObjectSet.object_set_id', backref='objects')

    def serialize(self):
        return {'object_id': self.object_id, 
        'name': self.name,
        'object_set_id': self.object_set_id}


class Video(Base):
    __tablename__ = 'videos'

    video_id = Column(Integer, primary_key=True,
                      nullable=False, autoincrement=True)
    file_path = Column(String(100), nullable=False, unique=True)
    timestamp = Column(DateTime)
    camera_id = Column(ForeignKey('cameras.camera_id', ondelete='CASCADE',
                                  onupdate='CASCADE'), nullable=False, index=True)

    camera = relationship(
        'Camera', primaryjoin='Video.camera_id == Camera.camera_id', backref='videos')

    def serialize(self):
        return {'video_id': self.video_id,
        'file_path': self.file_path,
        'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        'camera_id': self.camera_id}


class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True,
                      nullable=False, autoincrement=True)
    username = Column(String(100), nullable=False, unique=True)
    salt = Column(BLOB(128), nullable=False)
    hash = Column(BLOB(128), nullable=False)

    def serialize(self):
        return {'user_id': self.user_id,
        'username': self.username}
