"""
config.py

Contains configurations for flask server (see server.py). Expects localconfig.py file, see localconfig-example.py
"""
from os import path
try:
    path.exists("localconfig.py")
except:
    print("localconfig file not found, see localconfig-example.py")

from localconfig import LOCAL_SQL_URL

SQL_URL = LOCAL_SQL_URL
SCHEMA_NAME = 'panoptes'
SQLALCHEMY_DATABASE_URI = SQL_URL + '/' + SCHEMA_NAME
SQLALCHEMY_TRACK_MODIFICATIONS = False
