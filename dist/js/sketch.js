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

const colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([0,1]);
let threads = new Object();
const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';
function setup() {
    createCanvas(windowWidth, 300);
    background(0);
    getBookDatas(userId)
      .then((bookDatas) => {
            for (const [index, title] of Object.entries(bookDatas)) {
                const param = {
                    title: title,
                    xspacing: 7,
                    theta: 0,
                    angularVelocity: 0.04,
                    amplitude: 75.0,
                    period: 200,
                    color: colorScale(0.5),
                    height: 300,
                }
                const thread = new Thread(param);
                threads[index] = thread
            }
      });
}

function draw() {
    background(0);
    for(let index in threads) {
        threads[index].render()
    }
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
        .catch((err) => console.error(err));
}
