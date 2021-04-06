import unittest

from flask import current_app
from flask_testing import TestCase

from backend.server import application


class TestDevelopmentConfig(TestCase):
    def create_app(self):
        application.config.from_object('project.server.config.DevelopmentConfig')
        return application

    def test_app_is_development(self):
        self.assertFalse(application.config['SECRET_KEY'] is 'my_precious')
        self.assertTrue(application.config['DEBUG'] is True)
        self.assertFalse(current_app is None)
        self.assertTrue(
            application.config['SQLALCHEMY_DATABASE_URI'] == 'postgresql://postgres:@localhost/flask_jwt_auth'
        )


class TestTestingConfig(TestCase):
    def create_app(self):
        application.config.from_object('project.server.config.TestingConfig')
        return application

    def test_app_is_testing(self):
        self.assertFalse(application.config['SECRET_KEY'] is 'my_precious')
        self.assertTrue(application.config['DEBUG'])
        self.assertTrue(
            application.config['SQLALCHEMY_DATABASE_URI'] == 'postgresql://postgres:@localhost/flask_jwt_auth_test'
        )


class TestProductionConfig(TestCase):
    def create_app(self):
        application.config.from_object('project.server.config.ProductionConfig')
        return application

    def test_app_is_production(self):
        self.assertTrue(application.config['DEBUG'] is False)


if __name__ == '__main__':
    unittest.main()