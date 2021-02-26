"""
utils.py

Contains definitions for utils functions:
    jsonify_result: takes row data in list (or as single row) from database and returns flask Response
    check_body: takes a request and checks it for the given body parameter keys
    unwrap_body: returns a dictionary representing the keys and values in the body of a request
    unwrap_db_result: throws error or returns result
"""

from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.exceptions import abort


def jsonify_result(results):

    # check if results are a list or not
    if type(results) == list:

        # jsonify each element of result
        return jsonify(list(map(lambda result: result.serialize(), results)))
    else:
        return jsonify(results.serialize())


def check_body(request, *keys):

    # check request
    if request.get_json() is None:
        return False

    # iterate over keys
    for key in keys:
        if key not in request.get_json():
            return False
    return True


def unwrap_body(request, *keys):

    # check for completely empty body
    not_empty = False
    for key in keys:
        if check_body(request, key):
            not_empty = True

    if not not_empty:
        return None

    body = {}

    # iterate over key
    for key in keys:

        # check if key in body and add it
        if check_body(request, key):
            body[key] = request.get_json()[key]
        else:
            body[key] = None
    return body


def unwrap_db_result(result):

    # check for error
    if result is None:
        abort(400)
    elif isinstance(result, SQLAlchemyError):
        abort(400, result)
    return jsonify_result(result)
