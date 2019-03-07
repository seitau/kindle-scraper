from polyglot.text import Text, Word
from polyglot.downloader import downloader
import flask

def parse_morpheme(request):
    request_json = request.get_json()
    if request_json and 'text' in request_json:
        downloader.download("morph2.en")     
        text = request_json['text']
        parsedText = Text(text)
        return flask.jsonify(result=parsedText.morphemes)
    else:
        return flask.jsonify(error='invalid request')
