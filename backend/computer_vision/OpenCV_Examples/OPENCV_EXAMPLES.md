# Computer Vision
Using computer vision is how we aim to set our project apart from other security footage software. We aim to be able to do basic motion detection as a first step to flag footage that should be saved after being recorded. We then aim to analyze the footage and classify the motion as a person, a vehicle, or something else (such as an animal or something blowing in the wind).

## OpenCV
We will be using [OpenCV](https://opencv.org/), a popular open-source computer vision library written in C and  ported to C++, Java, and Python. The official support for Python has not been updated since 2.7, so we will be using an [unofficial port of OpenCV for Python 3](https://pypi.org/project/opencv-python/). Despite being unofficial, this package is well maintained and used throughout the development community. In the future, we might try compiling our own OpenCV packages from the source.

### Motion Detection using MOG2 and KNN
Motion detection is done using OpenCV's background subtraction algorithms. The goal is essentially to look at a video frame by frame and see how regions of pixels change over time. Background pixels are ones that do not change, while foreground pixels do change. OpenCV's algorithm uses this basic idea to create a foreground mask over the image of areas that are moving frame by frame. Determining "change" is based on a threshold value to avoid graininess, and pixels are analyzed against a historical average. There are two available background subtractor classes detailed below.

 1. [MOG2](https://docs.opencv.org/master/d7/d7b/classcv_1_1BackgroundSubtractorMOG2.html)
MOG2 implements Gaussian mixture model background subtraction described by Zivkovic et al [here](https://www.sciencedirect.com/science/article/abs/pii/S0167865505003521) and [here](https://ieeexplore.ieee.org/document/1333992).
 2. [KNN](https://docs.opencv.org/master/db/d88/classcv_1_1BackgroundSubtractorKNN.html)
 K-nearest neighbors (KNN) background subtraction is also available, and further detailed in the [documentation](https://docs.opencv.org/master/db/d88/classcv_1_1BackgroundSubtractorKNN.html). This algorithm is used in the test described below.

### Object Identification using HOG
Histogram of oriented gradients (HOG) is a technique used to identify objects. The basic idea is to find the gradient of an image (using color value derivatives) and analyze their distribution. Gradient vectors have high magnitudes around edges and corners, and we can use the distribution as a feature in a machine learning algorithm to identify different shapes. OpenCV has a [HOG descriptor class](https://docs.opencv.org/3.4/d5/d33/structcv_1_1HOGDescriptor.html) that provides this capability. It also provides an out-of-the-box people detector model that can be used to identify humans in images. A basic test of this is described below.

## Tests in this Subdirectory
For convenience, all tests in this subdirectory are run in Jupyter notebooks. Although the current tests run quickly, future ones might be slower and require the ability to run code blocks one at a time.

It is recommended that tests are run in their own Python virtual environment. Required packages are specified in `requirements.txt` in the Computer Vision directory. 

To create a virtual environment run `python3 -m venv path/to/venv`. Activate the virtual environment by running the appropriate script in `venv/Scripts/`. For Windows Powershell, the script is `Activate.ps1`. Then install the appropriate packages by running `pip install -r requirements.txt`. This should install all the packages you need to run the Jupyter notebooks. To open them, run `jupyter notebook` in the directory containing the notebook files.

For more information on virtual environments, see the [documentation](https://docs.python.org/3/library/venv.html). For more information on Jupyter notebook, see [their documentation](https://jupyter.org/).

### MotionDetectionTest.ipynb
This test shows a basic implementation of background subtraction to detect motion in videos. The test video used is of a car going the wrong way on the freeway. The black and white image shows contours where motion is identified by looking at the surrounding regions and how they are changing. There is a lot of fine-tuning that can go into background subtraction to capture smaller or larger areas of movement. The purpose of this example is to get a baseline for how background subtraction can be used to detect movement. It is likely that we will have more false positives than false negatives using this method, which is ideal since we would rather record more video than necessary instead of deleting footage that is important.

### PeopleDetectionTest.ipynb
This test shows a basic implementation of the HOG descriptor class using the built-in people detector model. Two videos are analyzed in the example to show the effectiveness of the built-in model. The first, although featuring multiple people, is ineffective because the people are not fully in frame. The provided model does better when it can see the entire human frame, as evidenced by the second video. The second video also has its flaws though. It shows people running, and the built-in model appears to do better with people who are standing straight up or walking.
