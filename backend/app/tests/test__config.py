import unittest

from flask_testing import TestCase


class TestConfig(TestCase):
    def create_app(self, application):
        application.config.from_object('config')
        self.application = application
        return application

    def test_app_is_testing(self):
        self.assertFalse(self.application.config['SECRET_KEY'] is None)

if __name__ == '__main__':
    unittest.main()
