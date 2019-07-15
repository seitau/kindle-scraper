import firebase from '../common/firebase';
import * as line from '@line/bot-sdk';
import * as rp from 'request-promise';

let config;
let recruitApiKey;
if (process.env.NODE_ENV === 'test') {
    config = {
        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
        channelSecret: process.env.LINE_CHANNEL_SECRET,
    };
    recruitApiKey = process.env.RECRUIT_API_KEY;
} else {
    const channel_env = firebase.functions.config().channel;
    config = {
        channelAccessToken: channel_env.access_token,
        channelSecret: channel_env.secret,
    };
    recruitApiKey = firebase.functions.config().recruit.apikey;
}

const client = new line.Client(config);

function handleEvent(event) {
  console.log(event);
  let message;

  if (event.type === 'message' && event.message.type === 'text') {
      message = event.message.text;
      //const userId = event.source.userId;
      if(message.includes('とうりくん')) {
          const options = {
              method: 'POST',
              uri: 'https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk',
              form: {
                  apikey: recruitApiKey,
                  query: message.replace('とうりくん', ''),
              },
          };
          return rp(options)
              .then((response) => {
                  const res = JSON.parse(response);
                  console.log(res.results[0].reply);
                  return client.replyMessage(event.replyToken, { 
                      type: "text", 
                      text: res.results[0].reply
                  });
              })
              .catch((err) => {
                  console.error(err);
                  return err;
              });
      }
      return;
  } 

  if (event.type === 'join') {
    message = "みなさんのブログ管理をサポートする松坂桃李です。どうぞよろしくね!";
  }

  return client.replyMessage(event.replyToken, { type: "text", text: message });
}

export default firebase.functions
    .https.onRequest(async (req, res) => {
        return Promise
            .all(req.body.events.map(handleEvent))
            .then(result => res.status(200).send(`Success: ${result}`))
            .catch(err => res.status(400).send(err.toString()));
});
