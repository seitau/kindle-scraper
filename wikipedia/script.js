const langs = {
  'en': ['English', 'ws://wikimon.hatnote.com:9000'],
  'de': ['German', 'ws://wikimon.hatnote.com:9010'],
  'ru': ['Russian', 'ws://wikimon.hatnote.com:9020'],
  'uk': ['Ukrainian', 'ws://wikimon.hatnote.com:9310'],
  'ja': ['Japanese', 'ws://wikimon.hatnote.com:9030'],
  'es': ['Spanish', 'ws://wikimon.hatnote.com:9040'],
  'fr': ['French', 'ws://wikimon.hatnote.com:9050'],
  'nl': ['Dutch', 'ws://wikimon.hatnote.com:9060'],
  'it': ['Italian', 'ws://wikimon.hatnote.com:9070'],
  'sv': ['Swedish', 'ws://wikimon.hatnote.com:9080'],
  'ar': ['Arabic', 'ws://wikimon.hatnote.com:9090'],
  'fa': ['Farsi', 'ws://wikimon.hatnote.com:9210'],
  'he': ['Hebrew' , 'ws://wikimon.hatnote.com:9230'],
  'id': ['Indonesian', 'ws://wikimon.hatnote.com:9100'],
  'zh': ['Chinese', 'ws://wikimon.hatnote.com:9240'],
  'as': ['Assamese', 'ws://wikimon.hatnote.com:9150'],
  'hi': ['Hindi', 'ws://wikimon.hatnote.com:9140'],
  'bn': ['Bengali', 'ws://wikimon.hatnote.com:9160'],
  'pa': ['Punjabi', 'ws://wikimon.hatnote.com:9120'],
  'te': ['Telugu', 'ws://wikimon.hatnote.com:9165'],
  'ta': ['Tamil', 'ws://wikimon.hatnote.com:9110'],
  'ml': ['Malayalam', 'ws://wikimon.hatnote.com:9250'],
  'mr': ['Western Mari', 'ws://wikimon.hatnote.com:9130'],
  'kn': ['Kannada', 'ws://wikimon.hatnote.com:9170'],
  'or': ['Oriya', 'ws://wikimon.hatnote.com:9180'],
  'sa': ['Sanskrit', 'ws://wikimon.hatnote.com:9190'],
  'gu': ['Gujarati' , 'ws://wikimon.hatnote.com:9200'],
  'pl': ['Polish' , 'ws://wikimon.hatnote.com:9260'],
  'mk': ['Macedonian' , 'ws://wikimon.hatnote.com:9270'],
  'be': ['Belarusian' , 'ws://wikimon.hatnote.com:9280'],
  'sr': ['Serbian' , 'ws://wikimon.hatnote.com:9290'],
  'bg': ['Bulgarian' , 'ws://wikimon.hatnote.com:9300'],
  'hu': ['Hungarian', 'ws://wikimon.hatnote.com:9320'],
  'fi': ['Finnish', 'ws://wikimon.hatnote.com:9330'],
  'no': ['Norwegian', 'ws://wikimon.hatnote.com:9340'],
  'el': ['Greek', 'ws://wikimon.hatnote.com:9350'],
  'eo': ['Esperanto', 'ws://wikimon.hatnote.com:9360'],
  'pt': ['Portuguese', 'ws://wikimon.hatnote.com:9370'],
  'et': ['Estonian', 'ws://wikimon.hatnote.com:9380'],
  'wikidata': ['Wikidata' , 'ws://wikimon.hatnote.com:9220']
}

var modificationCount = {}
for(let lang in langs) {
  Object.defineProperty(modificationCount, lang, {
    value: 0,
    writable: true
  });
}

export var modCount = modificationCount

export function subscribe(lang, count) {
  const socket = new WebSocket(langs[lang][1]);

  // Connection opened
  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
  });

  // Listen for messages
  socket.addEventListener('message', function (event) {
    //console.log('Message from server in ' + lang + ': ' + event.data);
    count[lang]++
  });
}

export function getModificationCount(lang) {
  subscribe(lang);

  console.log(modificationCount[lang])
  return modificationCount[lang]
}

//setInterval(function() {
//  getModificationFrequency('en');
//  getModificationFrequency('ja');
//}, 5000);
//

