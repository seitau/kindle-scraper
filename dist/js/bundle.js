(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

class Thread {
  constructor(param) {
    this.xspacing = param.xspacing;
    this.width = windowWidth;
    this.theta = param.theta;
    this.angularVelocity = param.angularVelocity;
    this.amplitude = param.amplitude;
    this.period = param.period;
    this.dx = TWO_PI / this.period * this.xspacing;
    this.yvalues = new Array(floor(this.width / this.xspacing));
    this.color = param.color;
    this.circles = new Array();
    this.radius = 16;
    this.yaxis = param.yaxis;
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
      let cy = this.yaxis + this.yvalues[x];
      ellipse(cx, cy, this.radius, this.radius);
      this.circles.push({
        x: cx,
        y: cy
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

const colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([0, 1]);
let threads = new Object();
const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  getBookDatas(userId).then(bookDatas => {
    const bookDatasArray = Object.entries(bookDatas);

    for (let i = 0; i < bookDatasArray.length; i++) {
      var _bookDatasArray$i = _slicedToArray(bookDatasArray[i], 1);

      const title = _bookDatasArray$i[0];
      const param = {
        title: title,
        xspacing: 7,
        theta: 0,
        angularVelocity: 0.04,
        amplitude: 75.0,
        period: 200,
        color: colorScale(0.5),
        yaxis: 250 * i + 150
      };
      console.log(param.height);
      const thread = new Thread(param);
      threads[i] = thread;
    }
  });
}

function draw() {
  background(0);

  for (let i in threads) {
    threads[i].render();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function mousePressed() {
  thread.clicked(mouseX, mouseY);
}

function getBookDatas(userId) {
  const userRef = firebase.firestore().collection('users').doc(userId);
  const booksRef = userRef.collection('books');
  return booksRef.get().then(books => {
    let titles = new Array();
    books.forEach(book => {
      const title = book.data().title;
      titles.push(title);
    });
    let bookDatas = new Object();
    let promiseChain = Promise.resolve(bookDatas); //for (let i = 0; i < titles.length; i++) {

    for (let i = 0; i < 5; i++) {
      promiseChain = promiseChain.then(bookDatas => {
        return booksRef.doc(titles[i]).collection('lines').get().then(lines => {
          bookDatas[titles[i]] = new Array();
          lines.forEach(line => {
            bookDatas[titles[i]].push(line.data().line);
          });
          return Promise.resolve(bookDatas);
        }).catch(err => {
          console.error(err);
        });
      });
    }

    return promiseChain;
  }).catch(err => console.error(err));
}

},{}]},{},[1]);
