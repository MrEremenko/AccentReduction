from allosaurus.app import read_recognizer
import subprocess
import sys

# subprocess.call(
#     ['C:/Program Files/ffmpeg/bin/ffmpeg.exe', '-y', '-i', sys.argv[1] + sys.argv[2], sys.argv[1] + 'converted-' + sys.argv[2]])

# load your model
model = read_recognizer("eng2102")

# run inference -> æ l u s ɔ ɹ s
val = model.recognize(sys.argv[1] + sys.argv[2])
print(val.encode("utf-8"))
