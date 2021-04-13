"""
config.py

Contains configurations for flask server (see run.py). Expects localconfig.py file, see localconfig-example.py
"""
from os import path
try:
    path.exists("localconfig.py")
except:
    print("localconfig file not found, see localconfig-example.py")

from localconfig import LOCAL_SQL_URL, TOKENS
TOKENS = TOKENS
SQL_URL = LOCAL_SQL_URL
SCHEMA_NAME = 'panoptes'
SQLALCHEMY_DATABASE_URI = SQL_URL + '/' + SCHEMA_NAME
SQLALCHEMY_TRACK_MODIFICATIONS = False
# RTSP = {"rtsp_url": "rtsp://admin:admin@172.24.28.36/11"}
RTSP = {"rtsp_url": "rtsp://admin:admin@172.26.95.38/11"}
CORS_HEADERS = 'Content-Type'