from app.tests.base import BaseTestCase
import unittest

from flask_testing import TestCase
import utils

class TestUserModel(BaseTestCase):

    def test_decode_auth_token(self):

        user = self.db_helper.add_user('test@test.com', 'test')

        auth_token = utils.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
        self.assertTrue(user.decode_auth_token(auth_token) == 1)

if __name__ == '__main__':
    unittest.main()