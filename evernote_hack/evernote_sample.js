//const OAuth = require('oauth').OAuth2;
const callbackUrl = 'https://us-central1-kindle-7ef16.cloudfunctions.net/evernoteAuth';
const app = {
  consumerKey: 'seita',
  consumerSecret: '55e2694365545a34',
  evernoteHostName : 'https://www.evernote.com',
  success: () => {
    console.log('success!!');
  },
  failure: () => {
    console.log('failure!!');
  },
}

//function loginWithEvernote(app) {
const options = {
    consumerKey: app.consumerKey,
    consumerSecret: app.consumerSecret,
    callbackUrl: callbackUrl,
    signatureMethod: "HMAC-SHA1",
  };
//  oauth = new OAuth(
//    options.consumerKey,
//    options.consumerSecret,
//    app.evernoteHostName,
//    '/oauth',
//    '/oauth',
//  );
//  console.log(oauth)
//  oauth.get({'method': 'GET', 'url': app.evernoteHostName + '/oauth', 'success': app.success, 'failure': app.failure});
//}
//
//loginWithEvernote(app)
//
//var oauth2 = new OAuth2(server.config.keys.twitter.consumerKey,
//  twitterConsumerSecret,
//  'https://api.twitter.com/',
//  null,
//  'oauth2/token',
//  null);

var Evernote = require('evernote');
var client = new Evernote.Client({
  consumerKey: options.consumerKey,
  consumerSecret: options.consumerSecret,
  sandbox: false, 
  china: false,
});

client.getRequestToken(callbackUrl, function(error, oauthToken, oauthTokenSecret) {
  if (error) {
    console.error(error)
  }

  console.log('oauthToken: ' + oauthToken);
  console.log('oauthTokenSecret: ' + oauthTokenSecret);
  console.log('authorized url: ' + client.getAuthorizeUrl(oauthToken));
});
