# blob = "If the text is not tokenized properly, morphological analysis could offer a smart of way of splitting the text into its original units. Here, is an example:"
# blobWithoutSpace = blob.replace(" ", "")
# print(blobWithoutSpace)
# words = blob.replace(",", "").split()
# print(words)
# for w in words:
#     word = Word(w, language="en")
#     print(word.morphemes)
#
# def parseMorpheme(request):
#

if __name__ == "__main__":
    from polyglot.text import Text, Word
    from flask import Flask, request
    app = Flask(__name__)

    @app.route('/<string:text>')
    def index(text):
        parsedText = Text(text)
        print(parsedText.morphemes)
        return "done"

    app.run('127.0.0.1', 8000, debug=True)
