from polyglot.text import Text, Word
from polyglot.downloader import downloader
from flask import Flask, jsonify, request, Response
import simplejson as json

def parse_morpheme(request):
    request_json = request.get_json()
    response = Response()
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    if request.method == 'OPTIONS':
        headers = request.headers.get('Access-Control-Request-Headers')
        if headers:
            response.headers['Access-Control-Allow-Headers'] = headers

    if request_json and 'text' in request_json:
        downloader.download("morph2.en")     
        text = request_json['text']
        parsedText = Text(text)
        response.set_data(json.dumps({ "result": parsedText.morphemes }))
        response.status_code = 200
        return response
    else:
        response.set_data(json.dumps({ "error": 'invalid request' }))
        response.status_code = 400
        return response


