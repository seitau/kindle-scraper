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
const groupId = "Rbc2f4675368f47385fb4663a8129076e";

export default firebase.functions
    .https.onRequest(async (req, res) => {
        console.log(req.params.pusher);
        const message = "hogejoge";
        return client.pushMessage(groupId, {
            type: 'text',
            text: message,
        })
            .then(() => {
                return res.status(200).send(`Success: ${message}`)
            })
            .catch((err) => {
                return res.status(400).send(`Error: ${err.toString()}`);
            });
});
