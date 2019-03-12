import 'babel-polyfill';
import Threads from './threads';
import { getBookMetaData } from './helpers';
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
    //let userId = '';

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

            doms['select'].elem.option(title);
            doms['select'].elem.center('horizontal');
            const child = p5.createImg(metaData.image);;
            doms['slide'].elem.child(child);
            doms['slide'].elem.center('horizontal');
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

        const select = p5.createSelect();
        const slide = p5.createDiv().class('slick');
        //const email = p5.createInput('', 'text');
        //const password = p5.createInput('', 'password');
        //const scrape = p5.createInput('scrape!!');
        doms['select'] = {
            elem: select,
            offset: 200,
        };
        doms['slide'] = {
            elem: slide,
            offset: 260,
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

        select.changed(() => {
            errorMessage = '';
        });

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

        $('.slick').slick({
            slidesToShow: 2,
            slidesToScroll: 3,
            autoplay: true,
            autoplaySpeed: 2500,
        });
    }

    p5.setup = async function() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);
        await initializeDoms();
    }

    p5.draw = async function() {
        p5.background(0);
        const select = doms['select'];
        select.elem.hide();

        if (errorMessage !== '') {
            p5.showMessage(errorMessage);
            return
        } else if (userId === '') {
            p5.showMessage('You need to submit email address and password for scraping 🙇');
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
        } else if (scraped) {
            p5.showMessage('Could not find any books on your kindle');
        } else {
            p5.showMessage('Loading ...🤔');

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

