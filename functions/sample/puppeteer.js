const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fs = require('fs');

const pc = {
    name: 'Desktop 1920x1080',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
    viewport: {
        width: 1920,
        height: 1080
    }
};
const iPad = devices['iPad Pro'];
const cookies_path = './cookies_amazon.json';
const AMAZON_EMAIL = process.env.AMAZON_EMAIL;
const AMAZON_PASSWORD = process.env.AMAZON_PASSWORD;
const amazon_kindle_url = 'https://read.amazon.co.jp/notebook?ref_=kcr_notebook_lib';

async function login(page) {
    await page.waitFor(2000);

    await page.screenshot({path: 'images/amazon_loggingin.png'});
    await page.type('#ap_password', AMAZON_PASSWORD);
    await page.type('#ap_email', AMAZON_EMAIL);

    await page.click('#signInSubmit');
    await page.waitFor(5000);
    await page.screenshot({path: 'images/amazon_logined.png'});
}

async function restoreCookie(page) {
    const cookies = JSON.parse(fs.readFileSync(cookies_path, 'utf-8'));
    for (let cookie of cookies) {
        await page.setCookie(cookie);
    }
}

async function saveCookie(page) {
    const cookies = await page.cookies();
    fs.writeFileSync('cookies_amazon.json', JSON.stringify(cookies));
}

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();
    page.on('load', () => console.log('Page loaded'));

    console.log('Emulating device');
    await page.emulate(pc);

    console.log('Restoring cookie');
    await restoreCookie(page);

    browser.on('targetcreated', target => {
        const kindle_notebook_library = target.url();
        console.log('Going to ' + kindle_notebook_library);
        page.goto(kindle_notebook_library);
    });

    console.log('Opening amazon kindle website');
    await page.goto(amazon_kindle_url);
    await page.waitFor(2000);

    const books = await page.$$('div.kp-notebook-library-each-book');
    console.log('Book number: ' + books.length);

    for(const book of books) {
        const src = await book.$eval('.kp-notebook-cover-image', (img) =>  {
            return img.getAttribute('src');
        });
        console.log(src);
        await book.click()
        await page.waitFor(1000);

        const annotations = await page.$$eval('#highlight', (hls) => {
            return hls.map((hl) => hl.textContent)
        });
        //console.log(annotations)

        const title = await book.$eval('.kp-notebook-searchable', (e) => {
            return e.textContent;
        });
        //console.log(title);
    }

    //const frames = await page.frames();
    //const kindleLibraryIFrame = frames.find(f => f.name() === 'KindleLibraryIFrame' );

    //await kindleLibraryIFrame.$('#kindle_dialog_firstRun_button').then(frame => {
        //return frame.click();
    //});
    //await kindleLibraryIFrame.$('#kindleLibrary_button_notebook').then(frame => {
        //return frame.click();
    //});
    //await page.waitFor(3000);

    //console.log('Logging in ...');
    //await login(page);
    //console.log('Logging in done ...');
    //await page.goto('https://affiliate.amazon.co.jp/home');
    //await page.screenshot({path: 'images/amazon_login.png'});

    //await page.goto('https://affiliate.amazon.co.jp/home/reports?ac-ms-src=summaryforthismonth');
    //const commission = await page.evaluate(() => {
    //return document.querySelector('#ac-report-commission-commision-total').textContent;
    //});
    //console.log(commission);

    console.log('Taking screenshot ...');
    await page.screenshot({path: 'images/amazon_after.png'});
    await saveCookie(page);

    browser.close();
})();

