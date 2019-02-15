import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sha256 } from 'js-sha256';
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

const authenticate = async function(email, password) {
    const userId = sha256(email + password);
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {

    }
}

const firebase = {
    db,
    functions,
    admin,
};

export default firebase;
