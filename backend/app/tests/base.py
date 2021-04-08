from flask_testing import TestCase

from server import application, db
from database.database import DatabaseHelper

class BaseTestCase(TestCase):
    """ Base Tests """

    def create_app(self):
        application.config.from_object('project.server.config.TestingConfig')
        return application

    def setUp(self):
        db.create_all()
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
