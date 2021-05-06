"""
api.py

Blueprint for api for backend connection to db, actualized by flask server in run.py
Contains CRUD endpoints for all database tables in models.py
"""
from flask import Blueprint, request, abort, make_response
from app.utils.utils import jsonify_result, unwrap_body, unwrap_db_result, check_body, check_auth
from app.database.database import DatabaseHelper
from flask_httpauth import HTTPTokenAuth
from config import BaseConfig

# globals used by main server for this blueprint
db_helper = DatabaseHelper()
api = Blueprint('api', __name__)

@api.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = '*'
    header['Access-Control-Allow-Methods'] = '*'
    return response

# Token authorization vars and function
auth = HTTPTokenAuth(scheme='Bearer')
@auth.verify_token
def verify_token(token):
    result = check_auth(db_helper, token, BaseConfig.SESSION_KEY)
    print(result)
    if result is not None:
        return token


# CAMERAS
# 
# GET:
#   /cameras
#       @success: 200
#       @returns: {all cameras}
#   /cameras/{id}
#       @success: 200
#       @returns: {camera with id}
#
# POST:
#   /cameras
#       @body: {url:[url]} & {title:[title]}
#       @success: 201
#       @error: 400
#       @returns: {camera created} | {error}
#
# PUT:
#   /cameras/{id}
#       @body: {url:[url]} | {title:[title]}
#       @success: 200
#       @error: 400
#       @returns: {updated camera} | {error}
#
# DELETE:
#   /cameras/{id}
#       @success: 204
#       @returns: {nothing}
#
@api.route('/cameras', methods=['GET', 'POST'])
@auth.login_required
def cameras():
    if request.method == 'GET':
        return jsonify_result(db_helper.get_camera())
    elif request.method == 'POST':
        body = unwrap_body(request, 'url', 'title')
        if check_body(request, 'url', 'title'):
            response = unwrap_db_result(db_helper.add_camera(body.get('title'), body.get('url')))
            response.status_code = 201
            return response
        abort(400)


@api.route('/cameras/<camera_id>', methods=['GET', 'PUT', 'DELETE'])
@auth.login_required
def cameras_id(camera_id):
    if request.method == 'GET':
        return jsonify_result(db_helper.get_camera(camera_id=camera_id))
    elif request.method == 'PUT':
        body = unwrap_body(request, 'url', 'title')
        if body is not None:
            return unwrap_db_result(db_helper.update_camera(camera_id, title=body.get('title'), url=body.get('url')))
        abort(400)
    elif request.method == 'DELETE':
        db_helper.delete_camera(camera_id=camera_id)
        return make_response('', 204)


# INCIDENTS
# 
# GET:
#   /incidents 
#       @body: {object_id:[object id]} | {video_id:[video id]}
#       @success: 200
#       @returns: {all incidents, or all incidents with given object and video ids}
#   /incidents/{id}
#       @success: 200
#       @returns: {incident with id}
#   /incidents?camera_id={id}
#       @success: 200
#       @returns: {all incident and object pairs related to specified id}
#   /incidents?object_name={name}
#       @success:200
#       @returns: {all incidents with given object name}
#
# POST:
#   /incidents
#       @body: {start_time:[start time]} & {end_time:[end time]} & {object_id:[object id]} & {video_id:[video id]} | {timestamp:[time stamp in format YYYY-mm-dd HH:MM:SS]}
#       @success: 201
#       @error: 400
#       @returns: {incident created} | {error}
#
# PUT:
#   /incidents/{id}
#       @body: {start_time:[start time]} | {end_time:[end time]} | {object_id:[object id]} | {video_id:[video id]} | {timestamp:[time stamp in format YYYY-mm-dd HH:MM:SS]}
#       @success: 200
#       @error: 400
#       @returns: {updated incident} | {error}
#
# DELETE:
#   /incidents
#       @body: {start_time:[start time]} | {end_time:[end time]} | {object_id:[object id]} | {video_id:[video id]}
#       @success: 204
#       @returns: {nothing}
#   /incidents/{id}
#       @success: 204
#       @returns: {nothing}
#
@api.route('/incidents', methods=['GET','POST','DELETE'])
@auth.login_required
def incidents():
    body = unwrap_body(request, 'object_id', 'video_id', 'start_time', 'end_time', 'timestamp')
    if request.method == 'GET':
        camera_id = request.args.get('camera_id')
        object_name = request.args.get('object_name')
        if camera_id is not None:
            return jsonify_result(db_helper.get_incidents_by_camera_id(camera_id))
        elif object_name is not None:
            return jsonify_result(db_helper.get_incident_by_object_name(object_name))
        elif body is None:
            return jsonify_result(db_helper.get_incident())
        else:
            return jsonify_result(db_helper.get_incident(object_id=body.get('object_id'), video_id=body.get('video_id'), timestamp=body.get('timestamp')))
    elif request.method == 'POST':
        if check_body(request, 'object_id', 'video_id', 'start_time', 'end_time'):
            response = unwrap_db_result(db_helper.add_incident(start_time=body.get('start_time'), end_time=body.get('end_time'),
                                                               object_id=body.get('object_id'), video_id=body.get('video_id'), timestamp=body.get('timestamp')))
            response.status_code = 201
            return response
        abort(400)
    elif request.method == 'DELETE':
        if body is not None:
            db_helper.delete_incident(object_id=body.get('object_id'), video_id=body.get('video_id'), timestamp=body.get('timestamp'))
            return make_response('', 204)
        abort(400)


@api.route('/incidents/<incident_id>', methods=['GET', 'PUT', 'DELETE'])
@auth.login_required
def incidents_id(incident_id):
    body = unwrap_body(request, 'object_id', 'video_id', 'start_time', 'end_time', 'timestamp')
    if request.method == 'GET':
        if body is not None:
            return jsonify_result(db_helper.get_incident(incident_id=incident_id, object_id=body.get('object_id'), video_id=body.get('video_id'), timestamp=body.get('timestamp')))
        return jsonify_result(db_helper.get_incident(incident_id=incident_id))
    elif request.method == 'PUT':
        if body is not None:
            return unwrap_db_result(db_helper.update_incident(incident_id=incident_id, object_id=body.get('object_id'),
                                                           video_id=body.get('video_id'), start_time=body.get('start_time'),
                                                           end_time=body.get('end_time'), timestamp=body.get('timestamp')))
        abort(400)
    elif request.method == 'DELETE':
        db_helper.delete_incident(incident_id=incident_id, object_id=body.get('object_id'),
                                                              video_id=body.get('video_id'), timestamp=body.get('timestamp'))
        return make_response('', 204)


# SEARCH
# 
# GET:
#   /search?object_name={object name}
#       @success: 200
#       @returns: {all incidents and objects with object name like the one provided}
#
@api.route('/search', methods=['GET'])
@auth.login_required
def search_indcidents():
    object_name = request.args.get('object_name')
    return jsonify_result(db_helper.search_incident(object_name))


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
        body = unwrap_body(request, 'name')
        if check_body(request, 'name'):
            response = unwrap_db_result(db_helper.add_object_set(body.get('name')))
            response.status_code = 201
            return response
        abort(400)


@api.route('/object_sets/<object_set_id>', methods=['GET', 'PUT', 'DELETE'])
@auth.login_required
def object_sets_id(object_set_id):
    if request.method == 'GET':
        return jsonify_result(db_helper.get_object_set(object_set_id=object_set_id))
    elif request.method == 'PUT':
        body = unwrap_body(request, 'name')
        if body is not None:
            response = unwrap_db_result(
                db_helper.update_object_set(object_set_id, name=body.get('name')))
            response.status_code = 201
            return response
        abort(400)
    elif request.method == 'DELETE':
        db_helper.delete_object_set(object_set_id)
        return make_response('', 204)


# OBJECTS
# 
# GET:
#   /objects
#       @body: {object_set_id:[object set id]}
#       @success: 200
#       @returns: {all objects} | {all objects with given object set id}
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
    body = unwrap_body(request, 'name', 'object_set_id')
    if request.method == 'GET':
        if body is None:
            return jsonify_result(db_helper.get_object())
        else:
            return jsonify_result(db_helper.get_object(object_set_id=body.get('object_set_id')))
    elif request.method == 'POST':
        if check_body(request, 'name', 'object_set_id'):
            response = unwrap_db_result(
                db_helper.add_object(body.get('name'), body.get('object_set_id')))
            response.status_code = 201
            return response
        abort(400)


@api.route('/objects/<object_id>', methods=['GET', 'PUT', 'DELETE'])
@auth.login_required
def objects_id(object_id):
    if request.method == 'GET':
        return jsonify_result(db_helper.get_object(object_id=object_id))
    elif request.method == 'PUT':
        body = unwrap_body(request, 'name', 'object_set_id')
        if body is not None:
            return unwrap_db_result(
                db_helper.update_object(object_id, name=body.get('name'), object_set_id=body.get('object_set_id')))
        abort(400)
    elif request.method == 'DELETE':
        db_helper.delete_object(object_id)
        return make_response('', 204)


# VIDEOS
# 
# GET:
#   /videos
#       @success: 200
#       @returns: {all videos}
#   /videos/{id}
#       @success: 200
#       @returns: {video with id}
#
# POST:
#   /videos
#       @body: {file_path:[video file path]} & {camera_id:[camera id]} | {timestamp:[time stamp in format YYYY-mm-dd HH:MM:SS]}
#       @success: 200
#       @error: 400
#       @returns: {video created} | {error}
#
# PUT:
#   /videos/{id}
#       @body: {file_path:[video file path]} | {camera_id:[camera id]} | {timestamp:[time stamp in format YYYY-mm-dd HH:MM:SS]}
#       @success: 200
#       @error: 400
#       @returns: {updated camera} | {error}
#
# DELETE:
#   /videos/{id}
#       @success: 204
#       @returns: {nothing}
#
@api.route('/videos', methods=['GET', 'POST'])
@auth.login_required
def videos():
    if request.method == 'GET':
        return jsonify_result(db_helper.get_video())
    elif request.method == 'POST':
        body = unwrap_body(request, 'file_path', 'camera_id', 'timestamp')
        if check_body(request, 'file_path', 'camera_id'):
            response = unwrap_db_result(
                db_helper.add_video(body.get('file_path'), body.get('camera_id'), body.get('timestamp')))
            response.status_code = 201
            return response
        abort(400)


@api.route('/videos/<video_id>', methods=['GET', 'PUT', 'DELETE'])
@auth.login_required
def videos_id(video_id):
    if request.method == 'GET':
        return jsonify_result(db_helper.get_video(video_id=video_id))
    elif request.method == 'PUT':
        body = unwrap_body(request, 'file_path', 'camera_id', 'timestamp')
        if body is not None:
            return unwrap_db_result(
                db_helper.update_video(video_id, file_path=body.get('file_path'), camera_id=body.get('camera_id'), timestamp=body.get('timestamp')))
        abort(400)
    elif request.method == 'DELETE':
        db_helper.delete_video(video_id)
        return make_response('', 204)


# MISC
# GET:
#   /object_sets_and_objects
#       @success: 200
#       @returns: {all object sets and objects}
# 
@api.route('/object_sets_and_objects', methods=['GET', 'POST'])
@auth.login_required
def object_sets_and_objects():
    if request.method == 'GET':
        return jsonify_result(db_helper.get_object_sets_and_objects())