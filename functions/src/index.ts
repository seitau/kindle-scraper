import firebase from './common/firebase';

exports.evernoteAuth = firebase.functions.https.onRequest((req, res) => {
    const params = req.query;
    if (!params.hasOwnProperty('oauth_token')) {
        params['oauth_token'] = 'not provided';
    }
    return firebase.db.collection('auth').doc('evernote')
        .update({
            oauth_token: params['oauth_token'],
            oauth_verifier: params['oauth_verifier'],
            sandbox_lnb: params['sandbox_lnb']
        })
        .then(() => {
            console.log("Document written!: ", req.query);
            return res.status(200).send("Evernote auth successfully executed");
        })
        .catch((err) => {
            console.error("Error adding document: " + err);
            return res.status(500).send("Error adding document: " + err);
        });
});

exports.ogp = firebase.functions.https.onRequest((req, res) => {
    const parser = require("ogp-parser");
    const params = req.query;
    const chacheControl = 'public, max-age=31557600, s-maxage=31557600';
    if (!params.hasOwnProperty('url')) {
        console.error("Error getting ogp data: please provide url");
        return res.status(400).json({ error: "Error getting ogp data: please provide url" });
    }
    return parser(encodeURI(params['url']), false)
        .then((data) => {
            console.log(data);
            console.log(params['url']);
            if (!data.hasOwnProperty('title')) {
                console.error("Error getting ogp data: no ogpData returned");
                return res.status(500).json({ error: "no ogpData returned" });
            }
            const ogpData = {};
            ogpData['siteName'] = data.title;
            for(const prop in data.ogp) {
                if (/^og:/g.test(prop)) {
                    ogpData[prop.split(':')[1]] = data.ogp[prop][0];
                }
            }
            return res.status(200).set('Cache-Control', chacheControl).json(ogpData);
        })
        .catch((err) => {
            console.error("Error getting ogp data: " + err);
            return res.status(500).json({ error: err });
        });
});

exports.scrapeKindle = firebase.functions.https.onRequest(async (req, res) => {
    if (!/application\/json/g.test(req.get('content-type'))) {
        console.error("Error scraping kindle: request has to be application/json format");
        return res.status(400).json({ error: "Error scraping kindle: request has to be application/json format" });

    } else if (req.method !== "POST") {
        console.error("Error scraping kindle: request has to be post method");
        return res.status(400).json({ error: "Error scraping kindle: request has to be post method" });

    }

    const KindleScraper = require('./common/kindle-scraper').default;
    const puppeteer = require('puppeteer');
    const body = req.body;
    if (!body.hasOwnProperty('email') || !body.hasOwnProperty('password')) {
        console.error("Error scraping kindle: please provide email and password");
        return res.status(400).json({ error: "Error scraping kindle: please provide email and password" });
    }
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage()
    const scraper = new KindleScraper(browser, page, body.email, body.password);
    await scraper.scrapeKindle()
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: "Error scraping kindle: " + err });
        });
    return res.status(200).json({
        result: "Successfully scraped kindle",

    });
});

