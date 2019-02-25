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
            //ellipse(x * this.xspacing, windowHeight / 2 + this.yvalues[x], 16, 16);
            let cx = x * this.xspacing;
            let cy = 300/2 + this.yvalues[x];
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

let threadCircles = new Array();
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
}
function setup() {
    createCanvas(windowWidth, 300);
    thread = new Thread(param);
    //thread_2 = new Thread(10, 0.0, 0.04, 100.0, 500.0, 'blue');
    //thread_3 = new Thread(10, 3.0, 0.02, 80.0, 500.0, 'red');
    //thread_4 = new Thread(10, 6.0, 0.04, 90.0, 500.0, 'green');
    //thread_5 = new Thread(10, 1.0, 0.04, 70.0, 500.0, 'pink');
    //thread_6 = new Thread(10, 8.0, 0.01, 70.0, 500.0, 'gray');
    background(0);
}

function draw() {
    background(0);
    thread.render()
    //thread_2.render()
    //thread_3.render()
    //thread_4.render()
    //thread_5.render()
    //thread_6.render()
}

function windowResized() {
    resizeCanvas(windowWidth, 300);
    background(0);
}

function mousePressed() {
    thread.clicked(mouseX, mouseY);
}

