import 'babel-polyfill';
import Threads from './threads';
import { colorScale } from './helpers';

const sketch = function(p5) {
    const color = colorScale;
    const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';
    let threadOfWords = new Object();
    let loadingPercentage = 0;
    let sel; 

    p5.setup = async function() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);
        sel = p5.createSelect();
        sel.style('height', '30px');
        sel.style('line-height', '35px');
        sel.changed(async () => {
            if (!threadOfWords[sel.value()].initialized) {
                await threadOfWords[sel.value()].initialize();
            }
        });

        loadingPercentage += 10;
        const bookTitles = await getBookTitles(userId);
        loadingPercentage += 10;

        for (const title of bookTitles) {
            const param = {
                userId: userId,
                title: title,
            };
            const threads = new Threads(p5, param);
            threadOfWords[title] = threads;

            sel.option(title);
            sel.center('horizontal');
        }
    }

    p5.draw = async function() {
        p5.background(0);
        if (Object.entries(threadOfWords).length > 0) {
            sel.show();
            sel.position(p5.windowWidth/2, p5.windowHeight/2 + 200);
            sel.center('horizontal');
            if (threadOfWords[sel.value()].initialized) {
                threadOfWords[sel.value()].render();
            } else {
                threadOfWords[sel.value()].initialize();
            }
        } else {
            sel.hide();
            p5.fill('white');
            p5.rect(p5.windowWidth/4, p5.windowHeight/2, p5.windowWidth/2, 50, 5);
            p5.noStroke();
            p5.fill(color(0.49));
            const max = p5.windowWidth/2-10;
            const percentage = loadingPercentage/100
            p5.rect(p5.windowWidth/4+5, p5.windowHeight/2+5, max*percentage, 40, 5);

            p5.fill(0);
            p5.text(loadingPercentage + '%', p5.windowWidth/2, p5.windowHeight/2+10);
            p5.textSize(30);
            p5.textStyle(p5.BOLD);
            p5.textFont('Helvetica');
            p5.textAlign(p5.CENTER, p5.TOP);
        }
    }

    p5.windowResized = function() {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);
        sel.position(p5.windowWidth/2, p5.windowHeight/2 + 200);
        sel.center('horizontal');
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

