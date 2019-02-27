import firebase from '../common/firebase';
import language from '@google-cloud/language';

let serviceAccount;
if (process.env.NODE_ENV === 'test') {
    serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
} else {
    serviceAccount = firebase.functions.config().gcloud_service_account;
}
const client = new language.LanguageServiceClient(serviceAccount);

export default firebase.functions.https.onRequest(async (req, res) => {
    const params = req.query;
    const hasText = params.hasOwnProperty('line'); 
    const hasBook = params.hasOwnProperty('book'); 
    const hasUserId = params.hasOwnProperty('userId'); 
    if (!hasText || !hasBook || !hasUserId){
        return res.status(400).json({ error: "Invalid request: required params missing"});
    }

    const userRef = firebase.db.collection('users').doc(params.userId);
    const bookRef = userRef.collection('books').doc(params.book);
    const lineDoc: any = await bookRef.collection('lines').doc(params.line).get()
        .catch((err) => {
            return res.status(500).json({ error: err });
        });
    const lineData = lineDoc.data();
    if (lineData.hasOwnProperty('tags')) {
        return res.status(200).json({ result: lineData.tags });
    }
    const document = {
        content: params.line,
        type: 'PLAIN_TEXT',
    };
    try {
        const [ syntax ] = await client.analyzeSyntax({ document });
        const tags = new Array();
        syntax.tokens.forEach(part => {
            tags.push(part.partOfSpeech.tag);
        });
        await bookRef.collection('lines').doc(params.line).update({
            tags: tags,
        })
        return res.status(200).json({ result: tags });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
});
