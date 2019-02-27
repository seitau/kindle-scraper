import firebase from '../common/firebase';

export default firebase.functions.https.onRequest((req, res) => {
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
