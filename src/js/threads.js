import Thread from './thread';
import { colorScale, getBookLines } from './helpers';

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
            const lines = await getBookLines(this.userId, this.title);
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
                yaxis: p5.windowHeight/3,
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
            this.p5.showMessage('Sorry 😅. No highlighted part found in this book.');
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

