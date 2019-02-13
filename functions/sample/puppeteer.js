const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fs = require('fs');
const firebase = require('../common/firebase.js');
const cookiesPath = './cookies_amazon.json';
const AMAZON_EMAIL = process.env.AMAZON_EMAIL;
const AMAZON_PASSWORD = process.env.AMAZON_PASSWORD;
const amazonKindleUrl = 'https://read.amazon.co.jp/notebook?ref_=kcr_notebook_lib';
const pc = {
    name: 'Desktop 1920x1080',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
    viewport: {
        width: 1920,
        height: 1080
    }
};

async function login(page) {
    await page.screenshot({path: 'images/amazon_loggingin.png'});

    const password_input = await page.$('#ap_password');
    if(password_input !== null) {
        await page.type('#ap_password', AMAZON_PASSWORD);
    }

    const email_input = await page.$('#ap_email');
    if(email_input !== null) {
        await page.type('#ap_email', AMAZON_EMAIL);
    }

    await page.click('#signInSubmit');
    await page.screenshot({path: 'images/amazon_logined.png'});
}

async function restoreCookie(page) {
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
    for (let cookie of cookies) {
        await page.setCookie(cookie);
    }
}

async function saveCookie(page) {
    const cookies = await page.cookies();
    fs.writeFileSync('cookies_amazon.json', JSON.stringify(cookies));
}

async function scrapeBook(page, bookObject) {
    const id = bookObject.id;
    const book = bookObject.element;
    const title = await book.$eval('.kp-notebook-searchable', (e) => {
        return e.textContent;
    });
    const src = await book.$eval('.kp-notebook-cover-image', (img) =>  {
        return img.getAttribute('src');
    });
    console.log('scraping on page ' + page.num + ': ' + title);
    await page.click(`#` + id)
    await page.waitForSelector('.kp-notebook-annotation-container');

    const yellowHighlights = await page.$$('.kp-notebook-highlight-yellow');
    const blueHighlights = await page.$$('.kp-notebook-highlight-blue');

    const yellowAnnotations = (await Promise.all(yellowHighlights.map((yellowHl) => {
        return yellowHl.$eval('#highlight', (span) => span.textContent)
            .then((text) => text)
            .catch((err) => undefined);
    }))).filter((e) => e !== undefined);

    const blueAnnotations = (await Promise.all(blueHighlights.map((blueHl) => {
        return blueHl.$eval('#highlight', (span) => span.textContent)
            .then((text) => text)
            .catch((err) => undefined);
    }))).filter((e) => e !== undefined);

    return {
        title: title,
        image: src,
        yellowAnnotations: yellowAnnotations,
        blueAnnotations: blueAnnotations,
    };
}

async function scrapeBooks(page, books) {
    let bookDatas = new Array();
    for (const book of books) {
        bookDatas.push(await scrapeBook(page, book))
    }
    return bookDatas;
}

async function scrapeBooksParallelly(pages, booksMap) {
    let booksPromises = new Array();
    for (let i = 0; i < pages.length; i++) {
        booksPromises.push(scrapeBooks(pages[i], booksMap[i]));
    }
    return booksPromises;
}

(async () => {
    console.time("scraping time");
    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();
    page.on('load', () => console.log('Page loaded'));

    console.log('Emulating device');
    await page.emulate(pc);

    console.log('Restoring cookie');
    await restoreCookie(page);

    console.log('Opening amazon kindle website');
    await page.goto(amazonKindleUrl, {waitUntil: 'load'});

    const password_input = await page.$('#ap_password');
    if(password_input !== null) {
        console.log('Opening amazon kindle website');
        await login(page);
    }

    const eachBookSelector = 'div.kp-notebook-library-each-book';
    await page.waitForSelector(eachBookSelector);
    const bookList = await page.$$(eachBookSelector);
    let books = new Array();
    for(const book of bookList) {
        books.push({
            id: await (await book.getProperty('id')).jsonValue(),
            element: book,
        });
    }
    console.log('Book number: ' + books.length);

    let pages = new Array();
    page.num = 0
    pages.push(page);
    for (let i = 0; i < 2; i++) {
        const newPage = await browser.newPage();
        newPage.num = i + 1;
        await newPage.goto(amazonKindleUrl);
        pages.push(newPage)
    }

    const pagesNum = pages.length;
    const additionalNum = books.length % pagesNum;
    const iterationNum = (books.length - additionalNum) / pagesNum;
    if (iterationNum <= 0 && additionalNum === books.length) {
        console.error('books number too low');
    }
    let booksMap = new Object();
    for (let i = 0; i < pages.length; i++) {
        booksMap[i] = new Array();
    }
    for (let i = 0; i < iterationNum; i++) {
        for (let j = 0; j < pages.length; j++) {
            booksMap[j].push(books[i + iterationNum * j]);
        }
    }
    for (let i = 0; i < additionalNum; i++) {
        booksMap[i].push(books[pagesNum * iterationNum + i]);
    }
    try {
        const bookDatasList = await Promise.all(
            await scrapeBooksParallelly(pages, booksMap)
        );
        let bookDatas = new Array();
        for (const booksList of bookDatasList) {
            bookDatas = bookDatas.concat(booksList);
        }
    } catch(err) {
        console.error(err);
    }

    console.log('Taking screenshot ...');
    await page.screenshot({path: 'images/amazon_after.png'});
    await saveCookie(page);

    browser.close();
    console.timeEnd("scraping time");
})();

