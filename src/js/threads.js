import Thread from './thread';
import { colorScale } from './helpers';

export default class Threads {
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

