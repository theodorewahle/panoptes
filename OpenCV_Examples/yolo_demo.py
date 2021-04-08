import torch

# this tutorial is from the YOLO V5 Github page and can be found here:
# https://github.com/ultralytics/yolov5/issues/36

# Model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

# Images
dir = 'https://github.com/ultralytics/yolov5/raw/master/data/images/'
imgs = [dir + f for f in ('zidane.jpg', 'bus.jpg')]  # batched list of images

# Inference
results = model(imgs)

# Show results
results.show()
