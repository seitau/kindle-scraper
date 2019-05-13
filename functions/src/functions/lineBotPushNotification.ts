import firebase from '../common/firebase';
import * as line from '@line/bot-sdk';
import * as rp from 'request-promise';

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
        console.log(req.body);
        const body = req.body;
        let message;
        if(body.id === 'google-analytics') {
            message = getAnalyticsReport(body);
        } else if(body.id === 'google-adsense') {
            message = getAdSenseReport(body);
        } else {
            message = makeCommitReport(body);
        }

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

function makeCommitReport(body) {
    if (!body.hasOwnProperty('pusher') ||
        !body.hasOwnProperty('head_commit')) {
        return res.status(200).send(`Success: test request`)
    }
    const commitMessage = body.head_commit.message;
    const pusher = body.pusher.name;
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
    const message = `${committer}が${commitMessage}をコミットしてくれたみたい！`;
    return message + additionalMessage;
}

fuction getAnalyticsReport(body) {
    const options = {
        method: 'GET',
        uri: 'https://kanna-google-report.herokuapp.com/googleAnalyticsReport',
    };

    return rp(options)
        .then((response) => {
            const res = JSON.parse(response);
            let message = '今週の地域別閲覧数です！\n\n';
            let i = 0;
            for(const country in res) {
                if(i >= 10) {
                    break;
                }
                const str = `${i+1}: ${country} ${res[country]} views \n`;
                message += str;
                i++;
            }
            console.log(message);
            return message; 
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
}

fuction getAdSenseReport(body) {
    const options = {
        method: 'GET',
        uri: 'https://kanna-google-report.herokuapp.com/googleAdSenseReport',
    };

    return rp(options)
        .then((response) => {
            const res = JSON.parse(response);
            let message = '今週の日別収益です! \n\n';
            for(const date in res.earnings) {
                const str = `${date}: ${res.earnings[date]} yen \n`;
                message += str;
            }
            message += `total: ${res.total} yen \n`;
            console.log(message);
            return message; 
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
}

