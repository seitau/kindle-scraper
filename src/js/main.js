import P5 from 'p5'
import axios from 'axios';
import 'babel-polyfill';
const analyzeLanguageApiEndpoint = 'https://us-central1-kindle-7ef16.cloudfunctions.net/AnalyzeLanguage';

class Thread {
    constructor(p5, param) {
        this.p5 = p5;
        this.userId = param.userId;
        this.book = param.title;
        this.line = param.line;
        this.param = param;
        this.width = p5.windowWidth;
        this.circles = new Array();
        this.radius = 5;
        this.tags = new Array();
    }

    calculateWave() {
        const p5 = this.p5;
        this.theta += this.angularVelocity;

        let x = this.theta;
        for (let i = 0; i < this.yvalues.length; i++) {
            this.yvalues[i] = p5.sin(x) * this.amplitude;
            x += this.dx;
        }
    }

    async initialize() {
        await this.analyze();
        const p5 = this.p5;
        const param = this.param;
        this.xspacing = param.xspacing;
        this.theta = param.theta;
        this.angularVelocity = param.angularVelocity;
        this.amplitude = param.amplitude;
        this.period = param.period;
        this.dx = (p5.TWO_PI / this.period) * this.xspacing 
        this.yvalues = new Array(p5.floor(this.width / this.xspacing));
        this.color = param.color;
        this.yaxis = param.yaxis;
        console.log(this.tags)
    }

    async analyze() {
        try {
            const response = await axios.post(analyzeLanguageApiEndpoint, {
                userId: this.userId,
                book: this.book,
                line: this.line,
            });
            if (response.status === 200) {
                this.tags = response.data.result;
            }
        } catch (err) {
            console.error('Error analyzing thread: ' + err);
        }
    }

    render() {
        const p5 = this.p5;
        this.calculateWave();
        p5.noStroke();
        p5.fill(this.color);
        this.circles = new Array();
        for (let x = 0; x < this.yvalues.length; x++) {
            let cx = x * this.xspacing;
            let cy = this.yaxis + this.yvalues[x];
            p5.ellipse(cx, cy, this.radius, this.radius);
            this.circles.push({
                x: cx,
                y: cy,
            });
        }
    }

    clicked(x, y) {
        const p5 = this.p5;
        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            let d = p5.dist(x, y, circle.x, circle.y);
            if (d < this.radius) {
                console.log('ohohohohoh');
            }
        }
    }
}

class Threads {
    constructor(p5, book) {
        this.p5 = p5;
        this.threads = new Array();
        const lines = book.lines;
        for (const line of book.lines) {
            const param = {
                userId: book.userId,
                title: book.title,
                line: line,
                xspacing: 7,
                theta: 0,
                angularVelocity: 0.04,
                amplitude: 75.0,
                //period: 200,
                period: line.length * 50,
                color: colorScale(p5.random(1)),
                yaxis: 250 * book.index + 150,
            }
            const thread = new Thread(p5, param);
            this.threads.push(thread);
        }
    }

    async initialize() {
        for(const thread of this.threads) {
            await thread.initialize();
        }
    }

    render() {
        for(const thread of this.threads) {
            thread.render();
        }
    }

    clicked(x, y) {
        for(const thread of this.threads) {
            thread.clicked(x, y);
        }
    }
}

const colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([0,1]);
function getBookDatas(userId) {
    const userRef = firebase.firestore().collection('users').doc(userId);
    const booksRef = userRef.collection('books');
    return booksRef.get()
        .then((books) => {
            let titles = new Array();
            books.forEach((book) => {
                const title = book.data().title;
                titles.push(title);
            });

            let bookDatas = new Object();
            let promiseChain = Promise.resolve(bookDatas);
            //for (let i = 0; i < titles.length; i++) {
            for (let i = 0; i < 5; i++) {
                promiseChain = promiseChain.then((bookDatas) => {
                    return booksRef.doc(titles[i]).collection('lines').get()
                        .then((lines) => {
                            bookDatas[titles[i]] = new Array();
                            lines.forEach((line) => {
                                bookDatas[titles[i]].push(line.data().line);
                            });
                            return Promise.resolve(bookDatas);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                });
            }
            return promiseChain;
        })
        .catch((err) => console.error(err));
}

const sketch = function(p5) {
    const colorScale = colorScale;
    let threadsOfKnowledge = new Object();
    const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';
    const threadsCanvasHeight = 500;
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

new P5(sketch)

