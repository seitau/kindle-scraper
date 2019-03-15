export const colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([0,1]);

export async function getBookLines(userId, title) {
    const userRef = firebase.firestore().collection('users').doc(userId);
    const booksRef = userRef.collection('books');
    const lines = await booksRef.doc(title).collection('lines').get();
    let linesData = new Array();
    lines.forEach((line) => {
        linesData.push(line.data().line);
    });
    return linesData;
}

export async function getBookMetaData(userId) {
    const userRef = firebase.firestore().collection('users').doc(userId);
    const booksRef = userRef.collection('books');
    const books = await booksRef.get();
    let metaData = new Array();
    books.forEach((book) => {
        const title = book.data().title;
        const image = book.data().book_cover_image_url;
        metaData.push({
            title: title,
            image: image,
        });
    });
    return metaData;
}

export function initializeSlick() {
    $('.slick').slick({
        slidesToShow: 6,
        slidesToScroll: 3,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: false,
        respondTo: 'window',
        responsive: [
            {
                breakpoint: 1024,     // 600〜1023px
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 600,      // 480〜599px
                settings: {
                    slidesToShow: 3,
                }
            },
        ],
    });
}


