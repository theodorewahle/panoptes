# Backend

## Contents:
1. Application list/usage
2. Setup
3. Running

## Application list/usage
Server: Flask
Video Streaming: RTSP
Motion Detection/CV: openCV and Yolov5
Database: mySQL

## Setup
Must have libvlc.dll from VCL video player installed, see https://www.videolan.org/vlc/

Must have local sql instance running, see https://dev.mysql.com/downloads/, download and install
mysql shell and start an instance, note the password for the sql server.

NOTE: Mac users must download mysql shell using homebrew

Must have python3 and pip3 installed

Other modules found in requirements.txt.
Run from backend:

```
pip3 install -r requirements.txt
```

##Running

The local config needs to be set up in a file named localconfig.py. 
Once a local sql instance is running, see the localconfig-example.py
to configure the sql URL and the authorization tokens. tokens can be set up as one wishes but SQL
url must be 'mysql://username:password@host'

Now, backend can be run by calling
```
python3 server.py
```

Go to http://127.0.0.1:5000 in a browser to see application running locally

## Create an example database
### 1) Setup test database

From the mysql console, run the file `$PATH/database/generate_test_database.sql`. For example, if `$PWD = /Users/agatha/panoptes/backend/`, run:

```
source /Users/agatha/panoptes/backend/database/generate_test_database.sql
```

### 2) Populate test database
In order to populate the local mysql database run the `incident_generator.py` to generate the `incidents.txt` file. Then run the `generate_example_sql.py` file to generate the `populate_test_database.sql` file.

```
$ python3 incident_generator.py
$ python3 generate_example_sql.py
```

From the mysql console, run the file `$PATH/populate_test_database.sql`. For example, if `$PWD = /Users/agatha/panoptes/backend/`, run:

```
source /Users/agatha/panoptes/backend/populate_test_database.sql
```

# TODO

