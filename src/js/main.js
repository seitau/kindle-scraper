import 'babel-polyfill';
import Threads from './threads';
import { colorScale, getBookDatas } from './helpers';

const sketch = function(p5) {
    const colorScale = colorScale;
    const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';
    let threadOfWords = new Object();
    let bookNum = 0;
    let sel; 

    p5.setup = async function() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);
        p5.textAlign(p5.CENTER);
        sel = p5.createSelect();
        sel.position(p5.windowWidth/2, p5.windowHeight/2 + 200);

        const bookDatas = await getBookDatas(userId);
        let i = 0;
        const bookDatasArray = Object.entries(bookDatas);
        for (const [ title, lines ] of bookDatasArray) {
            if (lines.length === 0) {
                continue;
            }
            const book = {
                userId: userId,
                title: title,
                lines: lines,
                index: i,
            };
            const threads = new Threads(p5, book);
            await threads.initialize();
            threadOfWords[title] = threads;
            i++;
        }
        for (const title in threadOfWords) {
            sel.option(title);
            sel.center('horizontal');
        }
        bookNum = i;
    }

    p5.draw = function() {
        p5.background(0);
        //for(let title in threadsOfKnowledge) {
            //threadsOfKnowledge[title].render();
        //}
        if (sel.value().length > 0 && Object.entries(threadOfWords).length > 0) {
            threadOfWords[sel.value()].render();
        }
    }

    p5.windowResized = function() {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);
        sel.position(p5.windowWidth/2, p5.windowHeight/2 + 200);
        sel.center('horizontal');
        for (const title in threadOfWords) {
            for (const thread of threadOfWords[title].threads) {
                thread.yaxis = p5.windowHeight/2;
            }
        }
    }

    p5.mousePressed = function() {
        for (let title in threadOfWords) {
            threadOfWords[title].clicked(p5.mouseX, p5.mouseY);
        }
    }
}

new p5(sketch)

