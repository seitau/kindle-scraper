class Thread {
    constructor() {
        this.xspacing = 16;
        this.w;
        this.theta = 0.0;
        this.amplitude = 75.0;
        this.period = 400.0;
        this.dx; 
        this.yvalues;
    }

    render() {

    }

}

let xspacing = 16; // Distance between each horizontal location
let w; // Width of entire wave
let theta1 = 0.0; // Start angle at 0
let theta2 = 0.0; // Start angle at 0
let amplitude = 75.0; // Height of wave
let period = 400.0; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let yvalues1; // Using an array to store height values for the wave
let yvalues2; // Using an array to store height values for the wave

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    w = width + 16;
    dx = (TWO_PI / period) * xspacing;
    yvalues1 = new Array(floor(w / xspacing));
    yvalues2 = new Array(floor(w / xspacing));
}

function draw() {
    background(0);
    renderWave1();
    renderWave2();
}

function calcWave1() {
    // Increment theta (try different values for
    // 'angular velocity' here)
    theta1 += 0.04;

    // For every x value, calculate a y value with sine function
    let x = theta1;
    for (let i = 0; i < yvalues2.length; i++) {
        yvalues1[i] = sin(x) * amplitude;
        x += dx;
    }
}
function calcWave2() {
    // Increment theta (try different values for
    // 'angular velocity' here)
    theta2 += 0.01;

    // For every x value, calculate a y value with sine function
    let x = theta2;
    for (let i = 0; i < yvalues2.length; i++) {
        yvalues2[i] = sin(x) * amplitude;
        //x += dx;
    }
}

function renderWave1() {
    calcWave1();
    noStroke();
    fill(255);
    // A simple way to draw the wave with an ellipse at each location
    for (let x = 0; x < yvalues1.length; x++) {
        ellipse(x * xspacing, height / 2 + yvalues1[x], 16, 16);
    }
}
function renderWave2() {
    calcWave2();
    noStroke();
    fill(255);
    // A simple way to draw the wave with an ellipse at each location
    for (let x = 0; x < yvalues2.length; x++) {
        ellipse(x * xspacing, height / 2 + yvalues2[x], 16, 16);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}

