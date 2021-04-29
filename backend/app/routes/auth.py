from config import BaseConfig
from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql.functions import user
from werkzeug.exceptions import abort
from app.api.api import db_helper
from app.utils.utils import unwrap_body, encode_auth_token, decode_auth_token

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    body = unwrap_body(request, 'username', 'password')
    if body is not None:
        result = db_helper.add_user(body.get('username'), body.get('password'))
        if isinstance(result, SQLAlchemyError):
            abort(400, result)
        response = {
            'status': 'success',
            'auth_token': encode_auth_token(result.user_id, BaseConfig.SESSION_KEY)
        }
        return make_response(jsonify(response), 201)
    abort(400)

@auth.route('/login', methods=['POST'])
def login():
    body = unwrap_body(request, 'username', 'password')
    if body is not None:
        result = db_helper.check_login(body.get('username'), body.get('password'))
        if result is not None:
            response = {
                'status': 'success',
                'auth_token': encode_auth_token(result.user_id, BaseConfig.SESSION_KEY)
            }
            return make_response(jsonify(response), 200)
        else:
            abort(404)
    abort(400)

@auth.route('/logout', methods=['POST'])
def logout():
    pass