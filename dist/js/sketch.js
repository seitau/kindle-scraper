class Thread {
    constructor(param) {
        this.xspacing = param.xspacing;
        this.width = windowWidth;
        this.theta = param.theta;
        this.angularVelocity = param.angularVelocity;
        this.amplitude = param.amplitude;
        this.period = param.period;
        this.dx = (TWO_PI / this.period) * this.xspacing 
        this.yvalues = new Array(floor(this.width / this.xspacing));
        this.color = param.color;
        this.circles = new Array();
        this.radius = 16;
        this.height = param.height;
    }

    calculateWave() {
        this.theta += this.angularVelocity;

        let x = this.theta;
        for (let i = 0; i < this.yvalues.length; i++) {
            this.yvalues[i] = sin(x) * this.amplitude;
            x += this.dx;
        }
    }

    render() {
        this.calculateWave();
        noStroke();
        fill(this.color);
        this.circles = new Array();
        for (let x = 0; x < this.yvalues.length; x++) {
            let cx = x * this.xspacing;
            let cy = this.height/2 + this.yvalues[x];
            ellipse(cx, cy, this.radius, this.radius);
            this.circles.push({
                x: cx,
                y: cy,
            });
        }
    }

    clicked(x, y) {
        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            let d = dist(x, y, circle.x, circle.y);
            if (d < this.radius) {
                console.log('ohohohohoh');
            }
        }
    }
}

let thread;
let thread_2;
let thread_3;
let thread_4;
let thread_5;
let thread_6;
let threads = new Object();
let param = {
    xspacing: 7,
    theta: 0,
    angularVelocity: 0.04,
    amplitude: 75.0,
    period: 200,
    color: 'yellow',
    height: 300,
}
const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';

function setup() {
    createCanvas(windowWidth, 300);
    thread = new Thread(param);
    getBookDatas(userId)
      .then((bookDatas) => {

      });
    background(0);
}

function draw() {
    background(0);
    thread.render()
}

function windowResized() {
    resizeCanvas(windowWidth, 300);
    background(0);
}

function mousePressed() {
    thread.clicked(mouseX, mouseY);
}

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
        .then((bookDatas) => {
            for (const title in bookDatas) {
                console.log(title);
                console.log(bookDatas[title]);
            }
            return Promise.resolve();
        })
        .catch((err) => console.error(err));
}
