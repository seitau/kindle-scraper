from polyglot.text import Text, Word
import flask

def parse_morpheme(request):
    request_json = request.get_json()
    if request_json and 'text' in request_json:
        text = request_json['text']
        parsedText = Text(text)
        return flask.jsonify(result=parsedText.morphemes)
    else:
        return flask.jsonify(error='invalid request')
