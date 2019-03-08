import 'babel-polyfill';
import Threads from './threads';
import { colorScale } from './helpers';

const sketch = function(p5) {
    const color = colorScale;
    const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';
    let threadOfWords = new Object();
    let doms = new Object();

    p5.setup = async function() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);

        const select = p5.createSelect();
        const email = p5.createInput('email address for amazon account', 'text');
        const password = p5.createInput('password for amazon account', 'password');
        doms['email'] = [ email, 250 ];
        doms['password'] = [ password, 295 ];
        doms['select'] = [ select, 200 ];
        for (const [ propName, dom ] of Object.entries(doms)) {
            dom[0].style('height', '30px');
            dom[0].style('line-height', '35px');
            dom[0].center('horizontal');
            dom[0].position(p5.windowWidth/2, p5.windowHeight/2 + dom[1]);
        }

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
        const select = doms['select'][0];
        if (Object.entries(threadOfWords).length > 0) {
            select.show();
            select.center('horizontal');
            if (threadOfWords[select.value()].initialized) {
                threadOfWords[select.value()].render();
            } else {
                threadOfWords[select.value()].initialize();
            }
        } else {
            select.hide();
            //p5.fill('white');
            //p5.rect(p5.windowWidth/4, p5.windowHeight/2, p5.windowWidth/2, 50, 5);
            //p5.noStroke();
            //p5.fill(color(0.49));
            //const max = p5.windowWidth/2-10;
            //const percentage = loadingPercentage/100
            //p5.rect(p5.windowWidth/4+5, p5.windowHeight/2+5, max*percentage, 40, 5);

            p5.fill('yellow');
            p5.text('Loading ...🤔', p5.windowWidth/2, p5.windowHeight/2);
            p5.textSize(40);
            p5.textStyle(p5.BOLD);
            p5.textFont('Helvetica');
            p5.textAlign(p5.CENTER, p5.TOP);
        }
    }

    p5.windowResized = function() {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);
        for (const [ propName, dom ] of Object.entries(doms)) {
            dom[0].position(p5.windowWidth/2, p5.windowHeight/2 + dom[1]);
            dom[0].center('horizontal');
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

    async function getBookTitles(userId) {
        const userRef = firebase.firestore().collection('users').doc(userId);
        const booksRef = userRef.collection('books');
        const books = await booksRef.get();
        let titles = new Array();
        books.forEach((book) => {
            const title = book.data().title;
            titles.push(title);
        });
        return titles;
    }

}

new p5(sketch)

