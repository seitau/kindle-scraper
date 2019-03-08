import Thread from './thread';
import { colorScale, getBookData } from './helpers';

export default class Threads {
    constructor(p5, param) {
        this.p5 = p5;
        this.threads = new Array();
        this.initialized = false;
        this.lines = null;
        this.userId = param.userId;
        this.title = param.title;
    }

    async initialize() {
        const p5 = this.p5;

        this.initialized = true;
        if (this.lines === null) {
            const lines = await getBookData(this.userId, this.title);
            this.lines = lines;
        }

        for (const line of this.lines) {
            const param = {
                userId: this.userId,
                title: this.title,
                line: line,
                xspacing: 7,
                theta: 0,
                angularVelocity: 0.04,
                amplitude: 125.0,
                //period: 200,
                period: line.length * 50,
                color: colorScale(p5.random(1)),
                //yaxis: 400 * book.index + 200,
                yaxis: p5.windowHeight/2,
            }
            const thread = new Thread(p5, param);
            this.threads.push(thread);
        }

        for(const thread of this.threads) {
            await thread.initialize();
        }
    }

    render() {
        for(const thread of this.threads) {
            thread.render();
        }
        if (this.lines !== null && this.threads.length === 0) {
            const p5 = this.p5;
            p5.fill('yellow');
            p5.text('Sorry 😅. No highlighted part found in this book.', p5.windowWidth/2, p5.windowHeight/2);
            p5.textSize(40);
            p5.textStyle(p5.BOLD);
            p5.textFont('Helvetica');
            p5.textAlign(p5.CENTER, p5.TOP);
        }
    }

    clicked(x, y) {
        for(const thread of this.threads) {
            thread.clicked(x, y);
        }
    }

    windowResized() {
        for(const thread of this.threads) {
            thread.fullScreen();
        }
    }
}

