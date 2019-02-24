class Thread {
    constructor(xspacing, theta, angularVelocity, amplitude, period, color) {
        this.xspacing = xspacing;
        this.width = windowWidth;
        this.theta = theta;
        this.angularVelocity = angularVelocity;
        this.amplitude = amplitude;
        this.period = period;
        this.dx = (TWO_PI / this.period) * this.xspacing 
        this.yvalues = new Array(floor(this.width / this.xspacing));
        this.color = color;
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
        for (let x = 0; x < this.yvalues.length; x++) {
            ellipse(x * this.xspacing, windowHeight / 2 + this.yvalues[x], 16, 16);
        }
    }
}

let thread;
let thread_2;
let thread_3;
let thread_4;
let thread_5;
let thread_6;
function setup() {
    createCanvas(windowWidth, windowHeight);
    thread = new Thread(7, 10, 0.04, 75.0, 200.0, 'yellow');
    thread_2 = new Thread(10, 0.0, 0.07, 100.0, 500.0, 'blue');
    thread_3 = new Thread(10, 3.0, 0.02, 140.0, 500.0, 'red');
    thread_4 = new Thread(10, 6.0, 0.04, 160.0, 500.0, 'green');
    thread_5 = new Thread(10, 1.0, 0.08, 300.0, 500.0, 'pink');
    thread_6 = new Thread(10, 8.0, 0.01, 40.0, 500.0, 'gray');
    background(0);
}

function draw() {
    background(0);
    thread.render()
    thread_2.render()
    thread_3.render()
    thread_4.render()
    thread_5.render()
    thread_6.render()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}

