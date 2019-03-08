import axios from 'axios';
const analyzeLanguageApiEndpoint = 'https://us-central1-kindle-7ef16.cloudfunctions.net/AnalyzeLanguage';
const parseMorphemeApiEndpoint = 'https://us-central1-kindle-7ef16.cloudfunctions.net/parse_morpheme';

export default class Thread {
    constructor(p5, param) {
        this.p5 = p5;
        this.userId = param.userId;

        this.title = param.title;
        this.line = param.line;

        this.param = param;
        this.width = p5.windowWidth;
        this.circles = new Array();
        this.radius = 5;
        this.tags = new Array();
        this.morphemes = new Array();
        this.yvalues = new Array();
        this.color = 0;
        this.xspacing = 0;
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

    async initialize() {
        await this.analyze();
        const p5 = this.p5;
        const param = this.param;
        this.xspacing = param.xspacing;
        this.theta = param.theta;
        this.angularVelocity = param.angularVelocity;
        this.amplitude = param.amplitude;
        this.period = param.period;
        this.dx = (p5.TWO_PI / this.period) * this.xspacing 
        this.color = param.color;
        this.yaxis = param.yaxis;
        this.yvalues = new Array(p5.floor(this.width / this.xspacing));
    }

    async analyze() {

        try {
            const analysisResponse = await axios.post(analyzeLanguageApiEndpoint, {
                userId: this.userId,
                book: this.title,
                line: this.line,
            });
            if (analysisResponse.status === 200) {
                this.tags = analysisResponse.data.result.tags;
                this.morphemes = analysisResponse.data.result.contents;
            }
        } catch (err) {
            console.error('Error analyzing thread: ' + err);
        }

        if (/[a-zA-Z]/.test(this.line)) {
            const parseResponse = await axios.post(parseMorphemeApiEndpoint, {
                text: this.line.replace(/\s+|\,|\./g, ''),
            }).catch((err) => {
                console.error('Error parsing text: ' + err);
            });
            this.morphemes = parseResponse.data.result;
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

    fullScreen() {
        this.width = this.p5.windowWidth;
        this.yaxis = this.p5.baseHeight;
        const newArrayLength = this.p5.floor(this.width / this.xspacing);
        if (newArrayLength !== Infinity) {
            this.yvalues = new Array(newArrayLength);
        }
    }
}
