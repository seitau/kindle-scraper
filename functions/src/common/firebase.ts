import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const settings = {timestampsInSnapshots: true};

let serviceAccount;
if (process.env.NODE_ENV === 'test') {
    serviceAccount = require('../../../service_account/secret.json');;
} else {
    serviceAccount = functions.config().account.cert;
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
admin.firestore().settings(settings);
const db = admin.firestore()

const firebase = {
    db,
    functions,
    admin,
};

export default firebase;
