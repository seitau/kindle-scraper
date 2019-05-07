from polyglot.text import Text, Word

blob = "This is a sample text"
words = blob.replace(",", "").split()

for w in words:
    word = Word(w, language="en")
    print(word.morphemes)


