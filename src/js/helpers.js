export const colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([0,1]);

export function getBookDatas(userId) {
    const userRef = firebase.firestore().collection('users').doc(userId);
    const booksRef = userRef.collection('books');
    return booksRef.get()
        .then((books) => {
            let titles = new Array();
            books.forEach((book) => {
                const title = book.data().title;
                titles.push(title);
            });

            let bookDatas = new Object();
            let promiseChain = Promise.resolve(bookDatas);
            //for (let i = 0; i < titles.length; i++) {
            for (let i = 0; i < 5; i++) {
                promiseChain = promiseChain.then((bookDatas) => {
                    return booksRef.doc(titles[i]).collection('lines').get()
                        .then((lines) => {
                            bookDatas[titles[i]] = new Array();
                            lines.forEach((line) => {
                                bookDatas[titles[i]].push(line.data().line);
                            });
                            return Promise.resolve(bookDatas);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                });
            }
            return promiseChain;
        })
        .catch((err) => console.error(err));
}

