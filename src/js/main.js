import 'babel-polyfill';
import Threads from './threads';
import { getBookTitles } from './helpers';
import { sha256 } from 'js-sha256';
//const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';

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
    let bookNum = 0;
    let errorMessage = '';
    let userId = '';
    let userIdSet = false;
    function () {

        if (Object.keys(threadOfWords).length === 0) {
            const bookTitles = await getBookTitles(userId);
            bookNum = bookTitles.length;

            for (const title of bookTitles) {
                const param = {
                    userId: userId,
                    title: title,
                };
                const threads = new Threads(p5, param);
                threadOfWords[title] = threads;

        console.log(title);
                select.elem.option(title);
                select.elem.center('horizontal');
            }
    }

    p5.setup = async function() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);

        const select = p5.createSelect();
        const email = p5.createInput('', 'text');
        const password = p5.createInput('', 'password');
        const scrape = p5.createInput('scrape!!');
        doms['select'] = {
            elem: select,
            offset: 200,
        };
        doms['email'] = {
            elem: email,
            offset: 260,
        };
        doms['password'] = {
            elem: password,
            offset: 305,
        };
        doms['scrape'] = {
            elem: scrape,
            offset: 350,
        };

        email.attribute('placeholder', ' email address for amazon account');
        password.attribute('placeholder', ' password for amazon account');
        scrape.attribute('type', 'button');

        for (const [ propName, dom ] of Object.entries(doms)) {
            dom.elem.position(p5.halfWindowWidth, p5.baseHeight + dom.offset);
            dom.elem.center('horizontal');
        }


        select.changed(() => {
            errorMessage = '';
        });

        scrape.mousePressed(() => {
            const emailVal = email.value();
            const passwordVal = password.value();
            if (emailVal.length <= 0 || passwordVal === '') {
                errorMessage = 'Please provide email and password 🙇';
                return
            }
            userId = sha256(emailVal + passwordVal);
            console.log(userId)
        });

    }

    p5.draw = async function() {
        p5.background(0);
        const select = doms['select'];

        if (errorMessage !== '') {
            p5.showMessage(errorMessage);
            return
        } else if (userId === '') {
            select.elem.hide();
            p5.showMessage('You need to submit email and password for scraping 🙇');
            return
        }  

        if (Object.keys(threadOfWords).length > 0) {
            select.elem.show();
            select.elem.position(p5.halfWindowWidth, p5.baseHeight + select.offset);
            select.elem.center('horizontal');
            if (threadOfWords[select.elem.value()].initialized) {
                threadOfWords[select.elem.value()].render();
            } else {
                threadOfWords[select.elem.value()].initialize();
            }
        } else {
            select.elem.hide();
            p5.showMessage('loading ...🤔');
        }
    }

    p5.windowResized = function() {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);
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
}

new p5(sketch)

