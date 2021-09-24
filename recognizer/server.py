from flask import Flask
from flask import jsonify
from flask import request

from allosaurus.app import read_recognizer

import boto3

app = Flask(__name__)


@app.route('/pronounciation', methods=['POST'])
def pronounce():
    data = request.get_json()
    print(data)
    s3 = boto3.client('s3')
    s3.download_file('gradcent', data["file"],
                     './audio/' + data["file"] + ".wav")

    model = read_recognizer("eng2102")
    # run inference -> æ l u s ɔ ɹ s
    val = model.recognize('./audio/' + data["file"] + ".wav")
    return jsonify({'value': val})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
