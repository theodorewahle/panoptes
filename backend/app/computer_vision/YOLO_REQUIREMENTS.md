# Install Instructions for YOLO

## 1. Installing CUDA

You do not need CUDA to run the basic example, but it will likely be needed later on.

YOLOv5 depends on CUDA. You need to install it before running YOLO. You can find CUDA 11 [here](https://developer.nvidia.com/cuda-downloads). Follow the prompts to download the correct version. CUDA is not available for MacOS, only Linux and Windows. The installer will take care of the rest.

## 2. Installing PyTorch

It is recommended that you use a virtual environment to run this code. The same virtual environment can be used both for the YOLOv5 example (`yolo.py`) and the example notebooks in `./OpenCV_Examples/`.

To create a virtual environment run `python3 -m venv path/to/venv`. Activate the virtual environment by running the appropriate script in `venv/Scripts/`. For Windows Powershell, the script is `Activate.ps1`.

You will need PyTorch and dependencies which can be found [here](https://pytorch.org/get-started/locally/). Select the appropriate options (operating system, CUDA version, installer) for your environment and run the command. This document assumes you are using `pip` to install dependencies.

## 3. Install Additional Python Packages

The packages needed are found in `requirements.txt`. They can be installed using `pip` by running `pip install -r requirements.txt`.
