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
 
# TODO

