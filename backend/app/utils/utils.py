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
import jwt
import datetime


# jsonify_result(results)
# takes row data in list (or as single row) from database and returns flask Response
#
# Inputs:
#   @results: row of data (list), reply from request to SQLAlchemy
#
# returns:
#   results serialized to JSON format
def jsonify_result(results):

    # check if results are a list or not
    if type(results) == list:

        # check if list of tuples
        if all(isinstance(model_object, tuple) for model_object in results):
            serialized_result = []
            for model_objects in results:
                serialized_result.append(list(map(lambda model_object: model_object.serialize(), model_objects)))
            return jsonify(serialized_result)
        else:
            # jsonify each element of result
            return jsonify(list(map(lambda result: result.serialize(), results)))
    else:
        return jsonify(results.serialize())

# check_body(request, *keys)
# takes a request and checks it for the given body parameter keys
#
# Inputs:
#   @request: HTTP request
#   @*keys: some amount of keys
#
# returns:
#   @True: request contains at least one key
#   @False: request contains no keys
def check_body(request, *keys):

    # check request
    if request.get_json() is None:
        return False

    # iterate over keys
    for key in keys:
        if key not in request.get_json():
            return False
    return True

# unwrap_body(request, *keys)
# returns a dictionary representing the keys and values in the body of a request
#
# Inputs:
#   @request: HTTP request
#   @*keys: some amount of keys
#
# returns:
#   @body: dictionary of unwrapped body
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

# unwrap_db_result(result)
# checks if a result is an error
#
# Inputs:
#   @result: row of data (list), reply from request to SQLAlchemy
#
# returns:
#   @body: dictionary of unwrapped body
def unwrap_db_result(result):

    # check for error
    if result is None:
        abort(400)
    elif isinstance(result, SQLAlchemyError):
        abort(400, result)
    return jsonify_result(result)

# encode_auth_token(user_id, secret_key)
# creates a JWT for the given user given a secret key
#
# Inputs:
#   @user_id: the id of the user to create a JWT for
#   @secret_key: the secret key to encode a token with
#
# returns:
#   token created or exception
def encode_auth_token(user_id, secret_key):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            secret_key,
            algorithm='HS256'
        )
    except Exception as e:
        return e

# decode_auth_token(auth_token, secret_key)
# returns the user id encoded in a JWT
#
# Inputs:
#   @auth_token: the JWT to decode
#   @secret_key: the secret key to decode the token with
#
# returns:
#   user id encoded in JWT or execption if JWT is invalid
def decode_auth_token(auth_token, secret_key):
    try:
        print(auth_token)
        payload = jwt.decode(auth_token, secret_key, algorithms='HS256')
        return payload['sub']
    except jwt.ExpiredSignatureError:
        abort(401, 'Signature expired. Please log in again.')
    except jwt.InvalidTokenError:
        abort(401, 'Invalid token. Please log in again.')

    
# blacklisted(auth_token, secret_key)
# checks if the given auth token is blacklisted
#
# Inputs:
#   @auth_token: the JWT to check
#   @secret_key: the secret key to decode the token with
#
# returns:
#   True if blacklisted, False if not
blacklist = []
def blacklisted(auth_token, secret_key):
    for token in blacklist:
        
        # check if token is blacklisted
        if auth_token == token:
            return True

        # remove expired tokens
        try:
            jwt.decode(auth_token, secret_key, algorithms='HS256')
        except jwt.ExpiredSignatureError:
            blacklist.remove(token)
    return False

# add_to_blacklist(request)
# adds token given in request to blacklist
#
# Inputs:
#   @request: the request containing the auth token to blacklist
def add_to_blacklist(request):

    # parse token
    auth_token = request.headers['Authorization'].split()
    if not isinstance(auth_token, list) or len(auth_token) != 2 or auth_token[0] != 'Bearer':
        abort(401, "Bearer token missing or malformed")
    
    # add token to blacklist
    blacklist.append(auth_token[1])    

# check_auth(db_helper, auth_token, secret_key)
# checks if the given auth token is valid
#
# Inputs:
#   @db_helper: db helper reference to check user
#   @auth_token: the JWT to check
#   @secret_key: the secret key to decode the token with
#
# returns:
#   user if token is valid
def check_auth(db_helper, auth_token, secret_key):

    # parse token
    auth_token = auth_token.split()
    if not isinstance(auth_token, list) or len(auth_token) != 2 or auth_token[0] != 'Bearer':
        abort(401, "Bearer token missing or malformed")
    auth_token = auth_token[1]

    # get id
    user_id = decode_auth_token(auth_token, secret_key)

    # check if blacklisted
    if not blacklisted(auth_token, secret_key):

        # return user
        user = db_helper.get_user(user_id=user_id)
        if len(user) != 0:
            return user[0]
        abort(401)
    abort(401)
