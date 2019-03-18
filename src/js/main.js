import 'babel-polyfill';
import Threads from './threads';
import { getBookMetaData, initializeSlick } from './helpers';
import { sha256 } from 'js-sha256';
const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';

const sketch = function(p5) {
    p5.halfWindowWidth = p5.windowWidth/2;
    p5.baseHeight = p5.windowHeight/3;
    p5.showMessage = function(message) {
        this.background(0)
        this.fill('yellow');
        this.text(message, p5.halfWindowWidth, p5.baseHeight);
        this.textSize(40);
        this.textStyle(p5.BOLD);
        this.textFont('Helvetica');
        this.textAlign(p5.CENTER, p5.TOP);
    }
    let threadOfWords = new Object();
    let doms = new Object();
    let scraped = false;
    let errorMessage = '';
    let selectedTitle;

    async function getBookData(userId) {
        const bookMetaData = await getBookMetaData(userId)
            .catch((err) => {
                console.error('Error getting book Data: ' + err);
            });

        for (const metaData of bookMetaData) {
            const title = metaData.title;
            const param = {
                userId: userId,
                title: title,
            };
            const threads = new Threads(p5, param);
            threadOfWords[title] = threads;

            const child = p5.createImg(metaData.image).attribute('title', title);
            child.mousePressed(() => {
                selectedTitle = child.attribute('title');
                errorMessage = '';
            });
            doms['slide'].elem.child(child);
            doms['slide'].elem.center('horizontal');
            selectedTitle = title;
        }
        scraped = true;
    }

    async function clearData() {
        threadOfWords = new Object();
        scraped = false;
        errorMessage = '';
        userId = '';
        await initializeDoms();
    }

    async function initializeDoms() {
        for (const key in doms) {
            doms[key].elem.remove();
        }

        const slide = p5.createDiv().class('slick');
        //const email = p5.createInput('', 'text');
        //const password = p5.createInput('', 'password');
        //const scrape = p5.createInput('scrape!!');
        doms['slide'] = {
            elem: slide,
            offset: 240,
        };
        //doms['email'] = {
        //elem: email,
        //offset: 260,
        //};
        //doms['password'] = {
        //elem: password,
        //offset: 305,
        //};
        //doms['scrape'] = {
        //elem: scrape,
        //offset: 350,
        //};

        //email.attribute('placeholder', ' email address for amazon account');
        //password.attribute('placeholder', ' password for amazon account');
        //scrape.attribute('type', 'button');

        for (const [ propName, dom ] of Object.entries(doms)) {
            dom.elem.position(p5.halfWindowWidth, p5.baseHeight + dom.offset);
            dom.elem.center('horizontal');
        }

        //scrape.mousePressed(async () => {
        //await clearData();
        //const emailVal = email.value();
        //const passwordVal = password.value();
        //if (emailVal.length <= 0 || passwordVal === '') {
        //errorMessage = 'Please provide email address and password 🙇';
        //return
        //}
        //userId = sha256(emailVal + passwordVal);
        //await getBookData(userId);
        //});

        await getBookData(userId);
    }

    p5.setup = async function() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);
        await initializeDoms();
        //const background = p5.createDiv('').class('book');
        //background.child(p5.createImg("img/opened-book-png-6.png"));
        initializeSlick();
    }

    p5.draw = async function() {
        p5.background(0);

        if (errorMessage !== '') {
            p5.showMessage(errorMessage);
            return
        } else if (userId === '') {
            p5.showMessage('You need to submit email address and password for scraping 🙇');
            return
        }  

        if (Object.keys(threadOfWords).length > 0) {
            if (threadOfWords[selectedTitle].initialized) {
                threadOfWords[selectedTitle].render();
            } else {
                threadOfWords[selectedTitle].initialize();
            }
        } else if (scraped) {
            p5.showMessage('Could not find any books on your kindle');
        } else {
            p5.showMessage('Loading ...🤔');
        }
    }

    p5.windowResized = function() {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        p5.halfWindowWidth = p5.windowWidth/2;
        p5.baseHeight = p5.windowHeight/3;
        for (const [ propName, dom ] of Object.entries(doms)) {
            dom.elem.position(p5.halfWindowWidth, p5.baseHeight + dom.offset);
            dom.elem.center('horizontal');
        }
        for (const title in threadOfWords) {
            threadOfWords[title].windowResized();
        }
    }

    p5.mousePressed = function() {
        for (let title in threadOfWords) {
            threadOfWords[title].clicked(p5.mouseX, p5.mouseY);
        }
    }

    p5.mouseWheel = function(event) {
        for (let title in threadOfWords) {
            threadOfWords[title].mouseWheel(event);
        }
    }
}

new p5(sketch)

