import unittest

from run import application

from flask_testing import TestCase

class TestConfig(TestCase):
    def create_app(self):
        application.config.from_object('config.TestingConfig')
        return application

    def test_app_is_testing(self):
        self.assertFalse(self.app.config['SESSION_KEY'] is None)

if __name__ == '__main__':
    unittest.main()
