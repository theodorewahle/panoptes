"""
localconfig-example.py

Example for localconfig.py, file name must be localconfig.py and located in same directory as config.py
"""
import os

LOCAL_SQL_URL = 'mysql://username:password@localhost'
TOKENS = {
    "secret-token-1": "example1",
    "secret-token-2": "example2"
}
SECRET_KEY = os.urandom(24)