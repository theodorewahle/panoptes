from sqlalchemy.exc import SQLAlchemyError
from app.tests.base import BaseTestCase
import unittest

from app.utils.utils import encode_auth_token, decode_auth_token

class TestUserModel(BaseTestCase):

    def test_decode_auth_token(self):
        user = self.dbhelper.add_user('test@test.com', 'test')
        self.assertFalse(isinstance(user, SQLAlchemyError))
        auth_token = encode_auth_token(user.user_id, self.app.config['SESSION_KEY'])
        self.assertTrue(isinstance(auth_token, str))
        self.assertTrue(decode_auth_token(auth_token, self.app.config['SESSION_KEY']) == user.user_id)

if __name__ == '__main__':
    unittest.main()