from flask import Flask, jsonify, request
from flask_cors import CORS
import json

from main import manager

app = Flask(__name__)
CORS(app)

# Access this endpoint through: http://localhost:5000/


@app.route('/')
def index():
    return jsonify({'message': 'Hey, everything works!!'})

# Access this endpoint through: http://localhost:5000/complex-test


@app.route('/classesICanTake')
def websiteCall():
    classes = request.args.get('lis')
    print(classes)
    # json = json.loads(classes)
    classes = json.loads(classes)
    data = manager(classes)

    # for i in data:
    #     print(i)

    # print("DATA", data)
    # classes = manager(json)
    # for course in classes:
    #     print(course)
    # # print(json_data)
    # # print(type(json_data))

    # print("HERE", classes)
    # return jsonify("HERE")
    return (data)
