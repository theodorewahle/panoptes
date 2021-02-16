from sqlalchemy import Column, ForeignKey, Integer, MetaData, String
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


# all code generated using flask-sqlacodegen on existing schema forward engineered from .mwb file


Base = declarative_base()
metadata = Base.metadata


class Camera(Base):
    __tablename__ = 'cameras'

    camera_id = Column(Integer, primary_key=True, unique=True)
    url = Column(String(100), unique=True)



class Incident(Base):
    __tablename__ = 'incidents'

    start_time = Column(Integer, primary_key=True, nullable=False)
    end_time = Column(Integer, primary_key=True, nullable=False)
    object_id = Column(ForeignKey('objects.object_id', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True, nullable=False, index=True)
    video_id = Column(ForeignKey('videos.video_id', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True, nullable=False, index=True) 

    object = relationship('Object', primaryjoin='Incident.object_id == Object.object_id', backref='incidents')
    video = relationship('Video', primaryjoin='Incident.video_id == Video.video_id', backref='incidents')



class ObjectSet(Base):
    __tablename__ = 'object_sets'

    object_set_id = Column(Integer, primary_key=True, unique=True)
    name = Column(String(45), nullable=False, unique=True)



class Object(Base):
    __tablename__ = 'objects'

    object_id = Column(Integer, primary_key=True, unique=True)
    name = Column(String(45), nullable=False, unique=True)
    object_set_id = Column(ForeignKey('object_sets.object_set_id', ondelete='CASCADE', onupdate='CASCADE'), index=True)

    object_set = relationship('ObjectSet', primaryjoin='Object.object_set_id == ObjectSet.object_set_id', backref='objects')



class Video(Base):
    __tablename__ = 'videos'

    video_id = Column(Integer, primary_key=True, unique=True)
    file_path = Column(String(100), nullable=False, unique=True)
    camera_id = Column(ForeignKey('cameras.camera_id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True)

    camera = relationship('Camera', primaryjoin='Video.camera_id == Camera.camera_id', backref='videos')
