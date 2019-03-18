import axios from 'axios';
import { colorScale, countSyntacticUnits } from './helpers';
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
        this.theta = this.tags.length;
        this.angularVelocity = param.angularVelocity;
        this.amplitude = param.amplitude;
        this.period = this.morphemes.length * 50;
        this.dx = (p5.TWO_PI / this.period) * this.xspacing 
        this.yaxis = param.yaxis;
        this.yvalues = new Array(p5.floor(this.width / this.xspacing));

        let syntaxCount = 0;
        syntaxCount += countSyntacticUnits('NOUN', this.tags);
        syntaxCount += countSyntacticUnits('PUNCT', this.tags);
        syntaxCount += countSyntacticUnits('PRON', this.tags);
        syntaxCount += countSyntacticUnits('DET', this.tags);
        syntaxCount += countSyntacticUnits('NUM', this.tags);
        syntaxCount += countSyntacticUnits('AFFIX', this.tags);
        syntaxCount += countSyntacticUnits('ADV', this.tags);
        syntaxCount += countSyntacticUnits('PRT', this.tags);
        this.color = colorScale(syntaxCount / this.tags.length);
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
                return true;
            }
        }
        return false;
    }

    fullScreen() {
        this.width = this.p5.windowWidth;
        this.yaxis = this.p5.baseHeight;
        const newArrayLength = this.p5.floor(this.width / this.xspacing);
        if (newArrayLength !== Infinity) {
            this.yvalues = new Array(newArrayLength);
        }
    }

    mouseWheel(event, accumDelta) {
        const initialAmp = this.amplitude - accumDelta;

        if (initialAmp !== 125) {
            this.amplitude = 125 + accumDelta;
        }
        this.amplitude += event.delta;
    }
}
