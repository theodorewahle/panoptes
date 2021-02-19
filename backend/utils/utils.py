"""
utils.py

Contains definitions for utils functions:
    jsonify_result: takes row data in list (or as single row) from database and returns flask Response
    check_body: takes a request and checks it for the given body parameter keys
"""

from flask import jsonify
from flask.helpers import make_response

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