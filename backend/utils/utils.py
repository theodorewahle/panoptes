"""
utils.py

Contains definitions for utils functions:
    list_to_json: takes row data in list from database
"""

from flask import *
from json import dumps

def result_proxy_to_json(result):
    return dumps([{column: value for column, value in rowproxy.items()} for rowproxy in result])

def list_to_json(rows):
    rows_to_return = []
    for row in rows:
        rows_to_return.append(row_to_dict(row))
    return jsonify(rows_to_return)

def row_to_dict(row):
    dict = {}
    for col in row.__table__.columns:
        dict[col.name] = getattr(row, col.name)
    return dict
