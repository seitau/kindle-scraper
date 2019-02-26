import P5 from 'p5'

class Thread {
    constructor(p5, param) {
        this.p5 = p5;
        this.xspacing = param.xspacing;
        this.width = p5.windowWidth;
        this.theta = param.theta;
        this.angularVelocity = param.angularVelocity;
        this.amplitude = param.amplitude;
        this.period = param.period;
        this.dx = (p5.TWO_PI / this.period) * this.xspacing 
        this.yvalues = new Array(p5.floor(this.width / this.xspacing));
        this.color = param.color;
        this.circles = new Array();
        this.radius = 16;
        this.yaxis = param.yaxis;
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

const sketch = function(p5) {
    const colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([0,1]);
    let threads = new Object();
    const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';

  p5.setup = function() {
    p5.createCanvas(900, 900)
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.background(0);
    getBookDatas(userId)
      .then((bookDatas) => {
          const bookDatasArray = Object.entries(bookDatas);
          for (let i = 0; i < bookDatasArray.length; i++) {
              const [ title ] = bookDatasArray[i];
              const param = {
                  title: title,
                  xspacing: 7,
                  theta: 0,
                  angularVelocity: 0.04,
                  amplitude: 75.0,
                  period: 200,
                  color: colorScale(0.5),
                  yaxis: 250 * i + 150,
              }
              const thread = new Thread(p5, param);
              threads[i] = thread
          }
      });
  }

  p5.draw = function() {
    p5.background(0);
    for(let i in threads) {
        threads[i].render()
    }
  }

  p5.windowResized = function() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    p5.background(0);
  }

  p5.mousePressed = function() {
      thread.clicked(p5.mouseX, p5.mouseY);
  }
}

new P5(sketch)

//function setup() {
    //createCanvas(windowWidth, windowHeight);
    //background(0);
    //getBookDatas(userId)
      //.then((bookDatas) => {
          //const bookDatasArray = Object.entries(bookDatas);
          //for (let i = 0; i < bookDatasArray.length; i++) {
              //const [ title ] = bookDatasArray[i];
              //const param = {
                  //title: title,
                  //xspacing: 7,
                  //theta: 0,
                  //angularVelocity: 0.04,
                  //amplitude: 75.0,
                  //period: 200,
                  //color: colorScale(0.5),
                  //yaxis: 250 * i + 150,
              //}
              //console.log(param.height)
              //const thread = new Thread(param);
              //threads[i] = thread
          //}
      //});
//}

//function draw() {
    //background(0);
    //for(let i in threads) {
        //threads[i].render()
    //}
//}

//function windowResized() {
    //resizeCanvas(windowWidth, windowHeight);
    //background(0);
//}

//function mousePressed() {
    //thread.clicked(mouseX, mouseY);
//}

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
