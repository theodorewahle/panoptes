"""
api.py

Blueprint for api for backend connection to db, actualized by flask server in server.py
"""
from flask import Blueprint, request, abort
from utils.utils import *
from database.database import DatabaseHelper
from flask_httpauth import HTTPTokenAuth


# globals used by main server for this blueprint
db_helper = DatabaseHelper()
api = Blueprint('api', __name__)


# Token authorization vars and function
api.config.from_object('config')
auth = HTTPTokenAuth(scheme='Bearer')
@auth.verify_token
def verify_token(token):
    if token in api.config['TOKENS']:
        return api.config['TOKENS'][token]


# Endpoints for sql tables: cameras, incidents, object set, objects, and videos
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


@api.route('/incidents', methods=['GET'])
@auth.login_required
def incidents():
    camera_id = request.args.get('camera_id')
    if camera_id is not None:
        return jsonify_result(db_helper.get_incidents_by_camera_id(camera_id))
    else:
        return jsonify_result(db_helper.get_incident())


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


@api.route('/object', methods=['GET', 'POST'])
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
            response.status_code = 201
            return response
        abort(400)


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
