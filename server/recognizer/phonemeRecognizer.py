from allosaurus.app import read_recognizer
import subprocess

# subprocess.call(
#     ['C:/Program Files/ffmpeg/bin/ffmpeg.exe', '-i', '../audio/1631442624333-sentence.wav', '../audio/test.wav'])
# load your model
model = read_recognizer("eng2102")

# run inference -> æ l u s ɔ ɹ s
val = model.recognize('../audio/test.wav')
print(val)
