from . import models
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import CreateSchema
from sqlalchemy import create_engine

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

        
#database_helper = DatabaseHelper(Flask(__name__))
#database_helper.add_camera('www.some.url.com')
#print(database_helper.list_tables())
#for camera in database_helper.get_all_cameras():
    #print(str(camera.camera_id) + " " + camera.url)
