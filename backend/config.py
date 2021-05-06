"""
config.py

Contains configurations for flask server (see run.py).
"""
from os import path, urandom
try:
    path.exists("localconfig.py")
except:
    print("localconfig file not found, see localconfig-example.py")

from localconfig import LOCAL_SQL_URL, TOKENS


class BaseConfig:
    """Base configuration."""
    TOKENS = TOKENS
    SQL_URL = LOCAL_SQL_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    RTSP = {"rtsp_url": "rtsp://admin:admin@172.26.95.38/11"}
    CORS_HEADERS = 'Content-Type'
    SESSION_KEY = urandom(24)
    HOST = "127.0.0.1"
    PORT = 8000
    DEBUG = False
    LOAD_DOTENV = True

class TestingConfig(BaseConfig):
    """Testing configuration."""
    SCHEMA_NAME = 'panoptes-test'
    SQLALCHEMY_DATABASE_URI = BaseConfig.SQL_URL + '/' + SCHEMA_NAME


class ProductionConfig(BaseConfig):
    """Production configuration."""
    SCHEMA_NAME = 'panoptes'
    SQLALCHEMY_DATABASE_URI = BaseConfig.SQL_URL + '/' + SCHEMA_NAME
