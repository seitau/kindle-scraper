import 'babel-polyfill';
import Threads from './threads';
import { getBookTitles } from './helpers';
const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';

const sketch = function(p5) {
    p5.halfWindowWidth = p5.windowWidth/2;
    p5.baseHeight = p5.windowHeight/3;
    let threadOfWords = new Object();
    let doms = new Object();

    p5.setup = async function() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);

        const select = p5.createSelect();
        const email = p5.createInput('', 'text');
        const password = p5.createInput('', 'password');
        doms['select'] = {
            elem: select,
            offset: 200,
        };
        doms['email'] = {
            elem: email,
            offset: 250,
        };
        doms['password'] = {
            elem: password,
            offset: 295,
        };
        for (const [ propName, dom ] of Object.entries(doms)) {
            dom.elem.style('height', '30px');
            dom.elem.style('line-height', '35px');
            dom.elem.position(p5.halfWindowWidth, p5.baseHeight + dom.offset);
            dom.elem.style('border-radius', '5px');
            dom.elem.center('horizontal');
        }
        email.style('width', '300px');
        email.attribute('placeholder', ' email address for amazon account');
        email.center('horizontal');
        password.style('width', '300px');
        password.attribute('placeholder', ' password for amazon account');
        password.center('horizontal');

        select.changed(async () => {
            if (!threadOfWords[select.value()].initialized) {
                await threadOfWords[select.value()].initialize();
            }
        });

        const bookTitles = await getBookTitles(userId);

        for (const title of bookTitles) {
            const param = {
                userId: userId,
                title: title,
            };
            const threads = new Threads(p5, param);
            threadOfWords[title] = threads;

            select.option(title);
            select.center('horizontal');
        }
    }

    p5.draw = async function() {
        p5.background(0);
        const select = doms['select'];
        if (Object.entries(threadOfWords).length > 0) {
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
            p5.fill('yellow');
            p5.text('Loading ...🤔', p5.halfWindowWidth, p5.baseHeight);
            p5.textSize(40);
            p5.textStyle(p5.BOLD);
            p5.textFont('Helvetica');
            p5.textAlign(p5.CENTER, p5.TOP);
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

