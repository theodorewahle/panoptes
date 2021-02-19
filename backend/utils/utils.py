"""
utils.py

Contains definitions for utils functions:
    jsonify_result: takes row data in list (or as single row) from database and returns flask Response
    check_body: takes a request and checks it for the given body parameter keys
    unwrap_db_result: throws error or returns result
"""

from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.exceptions import abort

def jsonify_result(results):
    if type(results) == list:
        return jsonify(list(map(lambda result: result.serialize(), results)))
    else:
        return jsonify(results.serialize())


def check_body(request, *keys):
    if request.get_json() is None:
        return False
    for key in keys:
        if key not in request.get_json():
            return False
    return True

def unwrap_db_result(result):
    if isinstance(result, SQLAlchemyError):
        abort(400, result)
    return jsonify_result(result)