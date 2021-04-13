from app.database.database import DatabaseHelper
from flask_testing import TestCase

class BaseTestCase(TestCase):
    """ Base Tests """

    def create_app(self, application):
        application.config.from_object('project.server.config.TestingConfig')
        self.dbhelper = DatabaseHelper()
        self.dbhelper.initialize(application)
        return application

    def teardown(self):
        self.dbhelper.teardown()
