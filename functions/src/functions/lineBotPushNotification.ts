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
const seitaId = "Ua63321b405c49b05fa0769a72097c355";
const groupId1 = "Cd13e05dcea9ea75ed2ffcd05f99e0b11";
const groupId2 = "C2676e4daeb5d96586d923bbabcdd4926";

export default firebase.functions
    .https.onRequest(async (req, res) => {
        const body = req.body;
        let message;
        try {
            if(body.id === 'google-analytics') {
                message = await getAnalyticsReport(body);
            } else if(body.id === 'google-adsense') {
                message = await getAdSenseReport(body);
            } else if(body.id === 'google-analytics-pageview') {
                message = await getAnalyticsPageViewReport(body);
            } else {
                if (!body.hasOwnProperty('pusher') ||
                    !body.hasOwnProperty('head_commit')) {
                    return res.status(200).send(`Success: test request`)
                }
                message = makeCommitReport(body);
                return client.pushMessage(seitaId, {
                    type: 'text',
                    text: message,
                })
                    .then(() => {
                        return res.status(200).send(`Success: ${message}`)
                    })
            }
        } catch(err) {
            return res.status(400).send(`Error: ${err.toString()}`);
        }

        console.log(message)

        return client.pushMessage(groupId1, {
            type: 'flex',
            altText: 'report',
            contents: message,
        })
            .then(() => {
                return client.pushMessage(groupId2, {
                    type: 'flex',
                    altText: 'report',
                    contents: message,
                })
            })
            .then(() => {
                return res.status(200).send(`Success: ${message}`)
            })
            .catch((err) => {
                return res.status(400).send(`Error: ${err.toString()}`);
            });
    });

function makeCommitReport(body) {
    const commitMessage = body.head_commit.message;
    const pusher = body.pusher.name;
    let committer = '無名';
    let name = '無名';
    if (pusher === 'seita-uc') {
        committer = 'せいたくん';
        name = 'せいた';
    } else if (pusher === 'Noiseshunk') {
        committer = 'いけいけコンサルタント';
        name = 'しんのすけ';
    } else if (pusher === 'knose24') {
        committer = '筋トレ帰国子女';
        name = 'かずと';
    } else if (pusher === 'minaminamina53') {
        committer = 'みなたん';
        name = 'みな';
    } else if (pusher === 'riko-m') {
        committer = 'りこちゃん';
        name = 'りこ';
    } else if (pusher === 'Himadayooo') {
        committer = 'ひまわりちゃん';
        name = 'ひまわり';
    } 

    const messages = [
        "もっともっと頑張ってね!",
        `${committer}ありがとう!`,
        `${name}いいかんじ!`,
        `${name}この調子!`,
    ]
    const additionalMessage = messages[Date.now() % messages.length];
    const message = `${committer}が${commitMessage}をコミットしてくれたみたいだね！`;
    return message + additionalMessage;
}

function getAnalyticsReport(body) {
    const options = {
        method: 'GET',
        uri: 'https://kanna-google-report.herokuapp.com/googleAnalyticsReport',
    };

    return rp(options)
        .then((response) => {
            const res = JSON.parse(response);
            const subtitle = 'Google Analytics';
            const title = '今週の地域別閲覧数トップ10';
            let flexMessage = makeFlexMessageWithoutImage(subtitle, title)
            let i = 0;
            for(const country in res) {
                if(i >= 10) {
                    break;
                }
                const str = `${i+1}: ${country} ${res[country]} views \n`;
                flexMessage = addContent(flexMessage, `${i+1}: ${country}`, "sm",  res[country], 'views');
                i++;
            }
            console.log(flexMessage);
            return flexMessage;

        })
        .catch((err) => {
            console.error(err);
            return err;
        });
}

function getAnalyticsPageViewReport(body) {
    const options = {
        method: 'GET',
        uri: 'https://kanna-google-report.herokuapp.com/googleAnalyticsPageViewReport',
    };

    return rp(options)
        .then((response) => {
            const res = JSON.parse(response);
            const subtitle = "Google Analytics"
            const title = '今週のページ別閲覧数トップ10';
            let flexMessage = makeFlexMessageWithoutImage(subtitle, title)
            let i = 0;
            for(const pageTitle in res) {
                if(i >= 10) {
                    break;
                }
                flexMessage = addContent(flexMessage, `${i+1}: ${pageTitle}`, "xs", res[pageTitle], "views")
                i++;
            }
            console.log(flexMessage);
            return flexMessage;
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
}

function getAdSenseReport(body) {
    const options = {
        method: 'GET',
        uri: 'https://kanna-google-report.herokuapp.com/googleAdSenseReport',
    };

    return rp(options)
        .then((response) => {
            const res = JSON.parse(response);
            const subtitle = 'Google AdSense';
            const title = '今週の日別収益';
            let flexMessage = makeFlexMessageWithoutImage(subtitle, title)

            for(const date in res.earnings) {
                flexMessage = addContent(flexMessage, date, "sm", res.earnings[date], 'yen');
            }
            flexMessage = addTotal(flexMessage, res.total, 'yen')
            console.log(flexMessage);
            return flexMessage; 
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
}

function makeFlexMessageWithoutImage(subtitle, title) {
    const flexMessage = {
        type: "bubble",
        styles: {
            footer: {
                separator: true
            }
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: subtitle,
                    weight: "bold",
                    color: "#1DB446",
                    size: "sm"
                },
                {
                    type: "text",
                    text: title,
                    weight: "bold",
                    size: "md",
                    margin: "md"
                },
                {
                    type: "separator",
                    margin: "xxl"
                },
                {
                    type: "box",
                    layout: "vertical",
                    margin: "lg",
                    spacing: "xs",
                    contents: [],
                },
            ]
        }
    }

    return flexMessage;
}

function addContent(flexMessage, title, size, view, unit) {
    const contents = [
        {
            type: "text",
                text: title,
                size: size,
                color: "#555555",
                flex: 0
        },
        {
            type: "text",
            text: `${view} ${unit}`,
            size: size,
            color: "#111111",
            align: "end"
        }
    ];

    for(let i = 0; i < contents.length; i++ ) {
        flexMessage.body.contents[3].contents.push(contents[i])
    }

    return flexMessage;
}

function addTotal(flexMessage, view, unit) {
    const contents = [
        {
            type: "separator",
            margin: "xxl"
        },
        {
            type: "box",
            layout: "horizontal",
            contents: [
                {
                    type: "text",
                    text: "TOTAL",
                    size: "sm",
                    color: "#555555"
                },
                {
                    type: "text",
                    text: `${view} ${unit}`,
                    size: "sm",
                    color: "#111111",
                    align: "end"
                }
            ]
        },
    ];

    for(let i = 0; i < contents.length; i++ ) {
        flexMessage.body.contents[3].contents.push(contents[i])
    }

    return flexMessage;
}

