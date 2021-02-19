import pysftp
import datetime
import os
import ffmpeg

cnopts = pysftp.CnOpts()
cnopts.hostkeys = None   

# TODO: remove this from plaintext
myHostname = "167.71.191.225"
myUsername = "teddy"
myPassword = "password"

today_as_string = datetime.datetime.now().strftime("%Y%m%d")

raw_incidents = "incidents/raw/" + today_as_string + "/"
if not os.path.exists(raw_incidents):
    os.makedirs(raw_incidents)

converted_incidents = "incidents/converted/" + today_as_string + "/"
if not os.path.exists(converted_incidents):
    os.makedirs(converted_incidents)

def convert_video(relative_file_path):
    full_input_filepath = "incidents/raw/" + relative_file_path
    full_output_filepath = "incidents/converted/" + relative_file_path.replace(".264", ".mp4")

    shell_command_template = "ffmpeg -framerate 24 -i {} {}"
    shell_command = shell_command_template.format(full_input_filepath, full_output_filepath)

    if os.system(shell_command) != 0:
        print("conversion error: " + relative_file_path)
    
    cleanup_command = "rm incidents/converted/" + today_as_string + "/*.264"
    os.system(cleanup_command)

def fetch_todays_incidents():
    with pysftp.Connection(host=myHostname, username=myUsername, password=myPassword, cnopts=cnopts) as sftp:
        print ("Connection succesfully stablished ... ")
        with sftp.cd(today_as_string+ "/record"):
            all_files = [(attr.filename, attr.st_atime) for attr in sftp.listdir_attr()]

            for file_name, file_timestamp in all_files:
                full_file_path = raw_incidents + file_name
                print(full_file_path)
                if not os.path.exists(full_file_path):
                    sftp.get(file_name, full_file_path)
                    convert_video(today_as_string + file_name)
