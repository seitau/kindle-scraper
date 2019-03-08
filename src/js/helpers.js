export const colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([0,1]);

export async function getBookData(userId, title) {
    const userRef = firebase.firestore().collection('users').doc(userId);
    const booksRef = userRef.collection('books');
    const lines = await booksRef.doc(title).collection('lines').get();
    let linesData = new Array();
    lines.forEach((line) => {
        linesData.push(line.data().line);
    });
    return linesData;
}


