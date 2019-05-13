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
const groupId = "Cd13e05dcea9ea75ed2ffcd05f99e0b11";

export default firebase.functions
    .https.onRequest(async (req, res) => {
        const body = req.body;
        if (!body.hasOwnProperty('pusher') ||
            !body.hasOwnProperty('head_commit')) {
            return res.status(200).send(`Success: test request`)
        }
        console.log(req.body);

        const commitMessage = req.body.head_commit.message;
        const pusher = req.body.pusher.name;
        let committer = '無名';
        let name = '無名';
        if (pusher === 'seita-uc') {
            committer = 'イケイケエンジニア様';
            name = 'せいた';
        } else if (pusher === 'Noiseshunk') {
            committer = 'ズル剥けコンサルタント';
            name = 'しんのすけ';
        } else if (pusher === 'knose24') {
            committer = 'イキリ帰国子女';
            name = 'かずと';
        } 

        const messages = [
            "もっともっと頑張ってね！❤️",
            "このくらいで満足するなよ？❤️",
            `${committer}大好き！！！！`,
            `${name}${name}${name}${name}`,
            `${name}ならできると思ってた！`,
        ]
        const additionalMessage = messages[Date.now() % messages.length];

        const message = `${committer}が${commitMessage}をコミットしてくれたみたい！${additionalMessage}`;
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
