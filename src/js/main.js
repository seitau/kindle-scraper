import 'babel-polyfill';
import Threads from './threads';
import { colorScale, getBookDatas } from './helpers';

const sketch = function(p5) {
    const colorScale = colorScale;
    let threadsOfKnowledge = new Object();
    const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';
    const threadsCanvasHeight = 800;
    let bookNum = 5;

    p5.setup = function() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);
        getBookDatas(userId)
            .then(async (bookDatas) => {
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
                    threadsOfKnowledge[i] = threads;
                    i++;
                }
                bookNum = i;
                p5.createCanvas(p5.windowWidth, threadsCanvasHeight * bookNum);
            });
        p5.textAlign(p5.CENTER);
        const sel = p5.createSelect();
        sel.position(10, 10);
        sel.option('pear');
        sel.option('kiwi');
        sel.option('grape');
    }

    p5.draw = function() {
        p5.background(0);
        for(let i in threadsOfKnowledge) {
            threadsOfKnowledge[i].render();
        }
    }

    p5.windowResized = function() {
        p5.resizeCanvas(p5.windowWidth, threadsCanvasHeight * bookNum);
        p5.background(0);
    }

    p5.mousePressed = function() {
        for(let i in threadsOfKnowledge) {
            threadsOfKnowledge[i].clicked(p5.mouseX, p5.mouseY);
        }
    }
}

new p5(sketch)

