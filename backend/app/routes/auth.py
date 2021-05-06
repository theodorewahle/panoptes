from config import BaseConfig
from flask import Blueprint, request, make_response
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.exceptions import abort
from app.api.api import db_helper, auth
from app.utils.utils import unwrap_body, encode_auth_token, check_auth, add_to_blacklist

auth = Blueprint('auth', __name__)

# REGISTER
# 
# POST:
#   /register
#       @body: {username:[username]} & {password:[password]}
#       @success: 201
#       @error: 400
#       @returns: no content, bearer token in Authorization header
#
@auth.route('/register', methods=['POST'])
def register():
    body = unwrap_body(request, 'username', 'password')
    if body is not None:
        result = db_helper.add_user(body.get('username'), body.get('password'))
        if isinstance(result, SQLAlchemyError):
            abort(400, result)
        response = make_response("", 201)
        response.headers['Authorization'] = 'Bearer ' + encode_auth_token(result.user_id, BaseConfig.SESSION_KEY)
        return response
    abort(400)

# LOGIN
# 
# POST:
#   /login
#       @body: {username:[username]} & {password:[password]}
#       @success: 200
#       @error: 400 if malformed, 404 if user does not exist
#       @returns: no content, bearer token in Authorization header
#
@auth.route('/login', methods=['POST'])
def login():
    body = unwrap_body(request, 'username', 'password')
    if body is not None:
        result = db_helper.check_login(body.get('username'), body.get('password'))
        if result is not None:
            response = make_response("", 200)
            response.headers['Authorization'] = 'Bearer ' + encode_auth_token(result.user_id, BaseConfig.SESSION_KEY)
            return response
        else:
            abort(404)
    abort(400)

# LOGOUT
# 
# POST:
#   /logout
#       @body: nothing
#       @success: 200
#       @error: 401
#       @returns: Logout successful if logout is sucessful
#
@auth.route('/logout', methods=['POST'])
def logout():
    add_to_blacklist(request)
    return make_response("Logout successful", 200)
    