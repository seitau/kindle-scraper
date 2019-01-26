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

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
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

    const covers = await page.$$(".kp-notebook-library-each-book");
    console.log(covers.length)
    for(const cover of covers) {
        await cover.click();
        await page.waitFor(500);
    }

    //let covers = await page.$$("//div/span/a/h2[contains(@class, 'kp-noteb    ook-searchable')]");
    //covers.forEach(async (cover) => {
        //console.log(cover.name())
        ////await cover.click();
        //await page.waitFor(2000);
    //});
    
    //let properties = await covers[2].getProperties();
    //console.log(properties);

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

    await page.waitFor(2000);
    console.log('Taking screenshot ...');
    await page.screenshot({path: 'images/amazon_after.png'});
    const afterCookies = await page.cookies();
    fs.writeFileSync('cookies_amazon.json', JSON.stringify(afterCookies));

    browser.close();
})();

