"""
database.py

Contains definition for DatabaseHelper for helper methods for sqlAlchemy connection between flask and sql server
"""

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

    def add_camera(self, url):
        camera = models.Camera(url=url)
        self.db.session.add(camera)
        self.db.session.commit()
        return camera

    def get_all_cameras(self):
        return self.db.session.query(models.Camera).all()

    def get_all_incidents(self):
        return self.db.session.query(models.Incident).all()

    def get_incidents_by_camera_id(self, camera_id):
        return self.db.session.query(models.Incident) \
            .join(models.Video) \
                .join(models.Camera) \
                    .filter(models.Camera.camera_id == camera_id) \
                        .all()
