from hog_detection import HOGDetectionModel


print("running")


if __name__ == '__main__':
    detector = HOGDetectionModel()
    detector.detect("./usain_bolt.mp4")