from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import models

class DatabaseHelper():

    def __init__(self, app):
        self.app = app;
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:password@localhost/panoptes'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.db = SQLAlchemy(self.app, model_class=models.Base)
        self.db.create_all()

    def list_tables(self):
        print(self.db.engine.table_names())

    

        
database_helper = DatabaseHelper(Flask(__name__))
database_helper.list_tables()
