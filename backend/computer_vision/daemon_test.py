# import os
# import time

# while True:
#   os.system('echo " hello" >> /Users/dwhang/Desktop/21W/panoptes/backend/computer_vision/daemon.txt')
#   time.sleep(1)

# from daemon import Daemon
from py_daemon import Daemon
# from incident_generator import IncidentGenerator

class pantalaimon(Daemon):
    def run(self):
        print("test")
        # ig = IncidentGenerator()
        # incidents = ig.gen_incidents("20210226", "9.mp4")

#Create a new object of your class, specifying where you want your PID file to exist:

pineMarten = pantalaimon('./test.pid')
# pineMarten.start()
pineMarten.delpid()
