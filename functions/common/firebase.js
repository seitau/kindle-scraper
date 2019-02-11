const functions = require('firebase-functions');
const admin = require('firebase-admin');
const settings = {timestampsInSnapshots: true};

let service_account;
if (process.env.NODE_ENV === 'test') {
    serviceAccount = require('../../service_account/secret.json');;
} else {
    serviceAccount = functions.config().account.cert;
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
admin.firestore().settings(settings);
const db = admin.firestore()

const firebase = {
    db: db,
    functions: functions,
    admin: admin,
}

module.exports = firebase;
