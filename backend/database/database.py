from . import models
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import CreateSchema
from sqlalchemy import create_engine, text

# shema name, should be moved to config eventually
SCHEMA_NAME = 'panoptes'

class DatabaseHelper():


    def __init__(self, app):

        # attempt to create schema if it doesn't exist
        engine = create_engine('mysql://root:password@localhost')
        try:
            engine.execute(CreateSchema(SCHEMA_NAME))
        except:
            print(SCHEMA_NAME + " already exists.")

        # set up flask app config options, will be moved to config file eventually
        self.app = app;
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:password@localhost/' + SCHEMA_NAME
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        # set up database and create tables
        self.db = SQLAlchemy(self.app, model_class=models.Base)
        self.db.create_all()

    def list_tables(self):
        return self.db.engine.table_names()

    def add_camera(self, url):
        self.db.session.add(models.Camera(url=url))
        self.db.session.commit()

    def get_all_cameras(self):
        return self.db.session.query(models.Camera).all()

    def get_all_incidents(self):
        return self.db.session.query(models.Incident).all()

    def get_incidents_by_camera_id(self, camera_id):
        SQL = text("SELECT incidents.* FROM cameras NATURAL JOIN videos NATURAL JOIN incidents WHERE camera_id = :camera_id")
        return self.db.engine.execute(SQL, {'camera_id': camera_id}).fetchall()

