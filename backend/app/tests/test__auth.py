import unittest

from flask import current_app
from flask_testing import TestCase

from server import application
from database.database import DatabaseHelper

class TestUserModel(BaseTestCase):

    def test_decode_auth_token(self):

        db_helper = DatabaseHelper()
        db_helper.initialize(application)

        user = db_helper.add_user('test@test.com', 'test')

        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
        self.assertTrue(user.decode_auth_token(auth_token) == 1)

if __name__ == '__main__':
    unittest.main()