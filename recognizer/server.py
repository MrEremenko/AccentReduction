from flask import Flask
from flask import jsonify
from flask import request

from allosaurus.app import read_recognizer
import os
import boto3

app = Flask(__name__)


ENGLISH_IPA = {}

with open("./ipa/en_US.txt", encoding="utf8") as file_in:
    lines = []
    for line in file_in:
        word = line[0:line.find('/')].strip()
        pronounciations = line[line.find('/'):line.rfind('/') + 1].split(',')
        for i in range(len(pronounciations)):
            pronounciations[i] = pronounciations[i].strip()
        ENGLISH_IPA[word] = pronounciations


@app.route('/pronounciation', methods=['POST'])
def pronounce():
    # grab the information from the server
    data = request.get_json()
    # download the file temporarily into the folder
    s3 = boto3.client('s3')
    s3.download_file('gradcent', data["file"],
                     './audio/' + data["file"] + ".wav")

    # set up the model
    model = read_recognizer("eng2102")
    # run inference -> æ l u s ɔ ɹ s
    val = model.recognize('./audio/' + data["file"] + ".wav")
    # remove the file
    os.remove('./audio/' + data["file"] + ".wav")

    # create the 'actual' which uses the ENGLISH_IPA
    words = data["sentence"].split()

    for i in range(len(words)):
        words[i] = words[i].lower()

    build = ""
    for word in words:
        pro = ENGLISH_IPA[word][0]
        build = build + \
            ' '.join(list(pro[1:len(pro) - 1].replace("ˈ", ""))) + " "

    return jsonify({'actual': val, 'theory': build})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
