"""
api.py

Blueprint for api for backend connection to db, actualized by flask server in server.py
"""
from flask import Blueprint, request, abort, current_app
from utils.utils import *
from database.database import DatabaseHelper
from flask_httpauth import HTTPTokenAuth


# globals used by main server for this blueprint
db_helper = DatabaseHelper()
api = Blueprint('api', __name__)


# Token authorization vars and function
auth = HTTPTokenAuth(scheme='Bearer')
@auth.verify_token
def verify_token(token):
    if token in current_app.config['TOKENS']:
        return current_app.config['TOKENS'][token]


# CAMERAS
# 
# GET:
#   /cameras 
#       @returns: all cameras
#   /cameras/id
#       @returns: camera with specified id
#
# POST:
#   /cameras
#       @body: url:[url]
#       @returns: camera created (or error)
#
# PUT:
#   /cameras/id
#       @body: url:[url]
#       @returns: updated camera
#
# DELETE:
#   /cameras/id
#       @returns: nothing or error
#
@api.route('/cameras', methods=['GET', 'POST'])
@auth.login_required
def cameras():
    if request.method == 'GET':
        return jsonify_result(db_helper.get_camera())
    elif request.method == 'POST':
        if check_body(request, 'url'):
            url = request.get_json()['url']
            response = unwrap_db_result(db_helper.add_camera(url))
            response.status_code = 201
            return response
        abort(400)

# INCIDENTS
# 
# GET:
#   /incidents 
#       @returns: all incidents
#   /incidents/id
#       @returns: incident with specified id
#   /incidents?camera_id
#       @returns: all incidents related to specified camera id
#
@api.route('/incidents', methods=['GET'])
@auth.login_required
def incidents():
    camera_id = request.args.get('camera_id')
    if camera_id is not None:
        return jsonify_result(db_helper.get_incidents_by_camera_id(camera_id))
    else:
        return jsonify_result(db_helper.get_incident())


# OBJECT SETS
# 
# GET:
#   /object_sets
#       @success: 200
#       @returns: {all object sets}
#   /object_sets/{id}
#       @success: 200
#       @returns: {object set with id}
#
# POST:
#   /object_sets
#       @body: {name:[object set name]}
#       @success: 200
#       @error: 400
#       @returns: {object set created} | {error}
#
# PUT:
#   /object_sets/{id}
#       @body: {name:[object name]}
#       @success: 200
#       @error: 400
#       @returns: {updated object set} | {error}
#
# DELETE:
#   /object_sets/{id}
#       @success: 204
#       @returns: {nothing}
#
@api.route('/object_sets', methods=['GET', 'POST'])
@auth.login_required
def object_sets():
    if request.method == 'GET':
        return jsonify_result(db_helper.get_object_set())
    elif request.method == 'POST':
        if check_body(request, 'name'):
            name = request.get_json()['name']
            response = unwrap_db_result(db_helper.add_object_set(name))
            response.status_code = 201
            return response
        abort(400)


@api.route('/object_sets/<object_set_id>', methods=['GET', 'PUT', 'DELETE'])
@auth.login_required
def objects(object_set_id):
    if request.method == 'GET':
        return jsonify_result(db_helper.get_object_set(object_set_id=object_set_id))
    elif request.method == 'PUT':
        if check_body(request, 'name'):
            name = request.get_json()['name']
            response = unwrap_db_result(
                db_helper.update_object(object_set_id, name=name))
            response.status_code = 200
            return response
        abort(400)
    elif request.method == 'DELETE':
        return jsonify_result(db_helper.delete_object_set(object_set_id))


# OBJECTS
# 
# GET:
#   /objects
#       @success: 200
#       @returns: {all objects}
#   /objects/{id}
#       @success: 200
#       @returns: {object with id}
#
# POST:
#   /objects
#       @body: {name:[object name]} & {object_set_id:[object set id]}
#       @success: 200
#       @error: 400
#       @returns: {object created} | {error}
#
# PUT:
#   /objects/{id}
#       @body: {name:[object name]} | {object_set_id:[object set id]}
#       @success: 200
#       @error: 400
#       @returns: {updated object} | {error}
#
# DELETE:
#   /objects/{id}
#       @success: 204
#       @returns: {nothing}
#
@api.route('/objects', methods=['GET', 'POST'])
@auth.login_required
def objects():
    if request.method == 'GET':
        return jsonify_result(db_helper.get_object())
    elif request.method == 'POST':
        if check_body(request, 'name', 'object_set_id'):
            name = request.get_json()['name']
            object_set_id = request.get_json()['object_set_id']
            response = unwrap_db_result(
                db_helper.add_object(name, object_set_id))
            response.status_code = 200
            return response
        abort(400)


@api.route('/objects/<object_id>', methods=['GET', 'PUT', 'DELETE'])
@auth.login_required
def objects(object_id):
    if request.method == 'GET':
        return jsonify_result(db_helper.get_object(object_id=object_id))
    elif request.method == 'PUT':
        if check_body(request, 'name', 'object_set_id'):
            name = request.get_json()['name']
            object_set_id = request.get_json()['object_set_id']
            response = unwrap_db_result(
                db_helper.update_object(object_id, name=name, object_set_id=object_set_id))
            response.status_code = 200
            return response
        if check_body(request, 'name'):
            name = request.get_json()['name']
            response = unwrap_db_result(
                db_helper.update_object(object_id, name=name))
            response.status_code = 200
            return response
        if check_body(request, 'object_set_id'):
            object_set_id = request.get_json()['object_set_id']
            response = unwrap_db_result(
                db_helper.update_object(object_id, object_set_id=object_set_id))
            response.status_code = 200
            return response
        abort(400)
    elif request.method == 'DELETE':
        return jsonify_result(db_helper.delete_object(object_id))


@api.route('/videos', methods=['GET', 'POST'])
@auth.login_required
def videos():
    if request.method == 'GET':
        return jsonify_result(db_helper.get_video())
    elif request.method == 'POST':
        if check_body(request, 'file_path', 'camera_id'):
            file_path = request.get_json()['file_path']
            camera_id = request.get_json()['camera_id']
            response = unwrap_db_result(
                db_helper.add_video(file_path, camera_id))
            response.status_code = 201
            return response
        abort(400)