from flask import Flask, jsonify, request, Response
from main import parse_morpheme

if __name__ == "__main__":
    app = Flask(__name__)

    @app.route('/', methods=['POST'])
    def index():
        return parse_morpheme(request)

    app.run('127.0.0.1', 8000, debug=True)
