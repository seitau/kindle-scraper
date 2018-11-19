var FeedParser = require('feedparser');  
var request = require('request');  
var feed = 'https://en.wikipedia.org/w/api.php?hidebots=1&hidecategorization=1&hideWikibase=1&urlversion=1&days=7&limit=50&action=feedrecentchanges&feedformat=rss';

var req = request(feed);  
var feedparser = new FeedParser({});

var items = [];

req.on('response', function (res) {  
  this.pipe(feedparser);
});

feedparser.on('meta', function(meta) {  
  console.log('==== %s ====', meta.title);
});

feedparser.on('readable', function() {  
  while(item = this.read()) {
    // console.log(item);
    items.push(item);
  }
});

feedparser.on('end', function() {  
  // show titles
  items.forEach(function(item) {
    console.log('- [' + item.title + ']' + '(' + item.link + ')');
  });
});
