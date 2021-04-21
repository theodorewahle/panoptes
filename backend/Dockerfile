FROM tiangolo/uwsgi-nginx-flask:python3.8
COPY . /app
WORKDIR /app
RUN apt-get update
RUN apt-get install mariadb-server -y
RUN /etc/init.d/mysql start
RUN apt-get install ffmpeg libsm6 libxext6 vlc -y
# RUN apt-get install libmariadb-dev libmariadb-dev-compat libmariadb3
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
EXPOSE 5000
ENTRYPOINT [ "python3" ]
CMD [ "run.py" ]