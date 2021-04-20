from app.database.database import DatabaseHelper
from run import application
from flask_testing import TestCase

class BaseTestCase(TestCase):
    """ Base Tests """

    def create_app(self):
        application.config.from_object('config')
        self.dbhelper = DatabaseHelper()
        self.dbhelper.initialize(application)
        return application

    def teardown(self):
        self.dbhelper.teardown()
