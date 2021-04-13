import unittest

from flask import current_app
from flask_testing import TestCase

from backend.run import application

class TestConfig(TestCase):
    def create_app(self):
        application.config.from_object('config')
        return application

    def test_app_is_testing(self):
        self.assertFalse(application.config['SECRET_KEY'] is None)

if __name__ == '__main__':
    unittest.main()
