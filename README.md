# panoptes: the highly-searchable security video service

Right now, we have:

1. A backend server that streams video (click ![HERE](https://github.com/theodorewahle/panoptes/blob/main/backend/README.md) for more info, including how to run)
2. A frontend webapp that is deployed on heroku, and it will eventually stream video from the backend (see documentation ![HERE](https://github.com/theodorewahle/panoptes/blob/main/frontend/README.md))
3. Some experiments completed with computer vision (![HERE](https://github.com/theodorewahle/panoptes/blob/main/computer-vision/COMPUTER_VISION.md) is the readme for that)

# General Info

With your group, please agree on the following:

1. **Who is going to look at which platforms, get a rough task distribution**

- Teddy --> Streaming (HTTP Live Streaming (HLS))
- James --> Computer Vision (OpenCV)
- Charles --> Backend (Flask, PostgreSQL)
- Jack -->. Frontend (React)
- Dylan --> TBD! (he has COVID)

2. **When are you going to get together. You have to agree on a time to get together outside of the regularly scheduled classes.**
   
We will meet during class times.

3. **What is going to be your top priority? What is the single demonstration that you could do that would mean your project is a success. That will be your goal for March 1st.**
    
our "MVP"/prototype will have:
- streaming of static video files from server to client
- object-detection computer vision features built on top of that stream
- a React-based video browsing client
- a fully functioning Flask + PostgreSQL server to serve video files

4. **What are going to be your stretch goals? List at least one goal for this term and one for the next.**

This term:
- set up IoT hardware
- figure out how to live-stream from external cameras
- set up 24/7 live video streaming and recording from these cameras

Next term:
- enhanced suite of Computer Vision features
- user accounts

5. **What git project will you be using (github.com is required, I will be looking at your pushes to determine individual grades) and what git-workflow will you be using (feature branches (good idea), separate sub-repos (usually a bad idea), or a single developer branch? Continuous integration testing (good idea), a test-before-commit policy (bad idea), or a compile-before-commit policy (good idea)?)**
    
This is the repo!

6. **What is the license of your project? (you don't have to write open source software, you can also license the software to just your team members, but whatever you choose must be explicit)**

MIT License

