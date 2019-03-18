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
        this.accumDelta = 0;
        this.clickedThread = null;
        this.highlightedLineWidth = null;
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
                angularVelocity: 0.04,
                amplitude: 125 + this.accumDelta,
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
        if (this.clickedThread !== null) {
            const thread = this.clickedThread;
            this.showHighlightedLine(thread.line, thread.color);
        }
        if (this.lines !== null && this.threads.length === 0) {
            this.p5.showMessage('Sorry 😅. No highlighted part found in this book.');
        }
    }

    clicked(x, y) {
        for(const thread of this.threads) {
            const isClicked = thread.clicked(x, y);
            if (isClicked) {
                this.clickedThread = thread;
            }
        }
    }

    windowResized() {
        for(const thread of this.threads) {
            thread.fullScreen();
        }
    }

    mouseWheel(event) {
        this.accumDelta += event.delta;
        for(const thread of this.threads) {
            thread.mouseWheel(event, this.accumDelta);
        }
    }

    showHighlightedLine(line, color) {
        const p5 = this.p5;
        p5.fill(color);
        const lineLength = line.length * 40;
        if (this.highlightedLineWidth === null) {
            this.highlightedLineWidth = lineLength + 100;
        }
        this.highlightedLineWidth -= 15;
        if (this.highlightedLineWidth < lineLength * -0.8) {
            this.highlightedLineWidth = lineLength + 100;
        }
        if (lineLength > p5.windowWidth) {
            p5.text(line, this.highlightedLineWidth, p5.baseHeight+150);
        } else {
            p5.text(line, p5.halfWindowWidth, p5.baseHeight+150);
        }
        console.log(this.highlightedLineWidth)
        p5.textSize(40);
        p5.textStyle(p5.BOLD);
        p5.textFont('Helvetica');
        p5.textAlign(p5.CENTER, p5.TOP);
    }
}

