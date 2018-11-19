const functions = require('firebase-functions');
const admin = require('firebase-admin');
const settings = {timestampsInSnapshots: true};

let serviceAccount;
if (process.env.NODE_ENV === 'test') {
  serviceAccount = require('./service_account/kindle-7ef16-firebase-adminsdk-ksy3r-3fde325273.json');
} else {
  serviceAccount = functions.config().account.cert;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
admin.firestore().settings(settings);
const db = admin.firestore()

exports.evernoteAuth = functions.https.onRequest((req, res) => {
  const params = req.query;
  if (!params.hasOwnProperty('oauth_token')) {
    params['oauth_token'] = 'not provided';
  }
  return db.collection('auth').doc('evernote')
    .update({
      oauth_token: params['oauth_token'],
      oauth_verifier: params['oauth_verifier'],
      sandbox_lnb: params['sandbox_lnb']
    })
    .then(() => {
      console.log("Document written!: ", req.query);
      return res.send("Evernote auth successfully executed");
    })
    .catch((err) => {
      console.error("Error adding document: ", err);
      return res.send("Error adding document: ", err);
    });
});
