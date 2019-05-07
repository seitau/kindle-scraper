import firebase from '../common/firebase';
import * as line from '@line/bot-sdk';

let config;
if (process.env.NODE_ENV === 'test') {
    config = {
        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
        channelSecret: process.env.LINE_CHANNEL_SECRET,
    };
} else {
    const channel_env = firebase.functions.config().channel;
    config = {
        channelAccessToken: channel_env.access_token,
        channelSecret: channel_env.secret,
    };
}

const client = new line.Client(config);

function handleEvent(event) {
  console.log(event);
  let message = 'Please push text message.';

  if (event.type === 'message' && event.message.type === 'text') {
    message = event.message.text;
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
