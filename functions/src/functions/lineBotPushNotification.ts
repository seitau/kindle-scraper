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
        if (Object.keys(req.body).length === 0) {
            return res.status(200).send(`Success: empty request`)
        }
        console.log(req.body);

        const commitMessage = req.body.head_commit.message;
        const pusher = req.body.pusher.name;
        let commiter = '無名';
        if (pusher === 'seita-uc') {
            commiter = 'イケイケエンジニア様';
        } else if (pusher === 'Noiseshunk') {
            commiter = 'ズル剥けコンサルタント';
        } else if (pusher === 'knose24') {
            commiter = 'イキリ帰国子女';
        } 

        let additionalMessage;
        const num = Date.now() % 3;
        console.log(num);
        switch(num) {
            case 0:
                additionalMessage = "もっともっと頑張ってね！❤️";
                break;
            case 1:
                additionalMessage = "このくらいで満足するなよ？❤️";
                break;
            case 2:
                additionalMessage = `${commiter}大好き！！！！`;
                break;
        }

        const message = `${commiter}が${commitMessage}をコミットしてくれたみたい！${additionalMessage}`;
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
