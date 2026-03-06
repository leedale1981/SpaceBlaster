export class SynthMusic {
    private audioCtx: AudioContext | null;
    private masterGain: GainNode | null;
    private musicGain: GainNode | null;
    private drumGain: GainNode | null;
    private delayNode: DelayNode | null;
    private delayFeedback: GainNode | null;
    private noiseBuffer: AudioBuffer | null;
    private schedulerTimer: number | null;
    private isPlaying: boolean;
    private nextStepTime: number;
    private stepIndex: number;
    private readonly tempo: number;
    private readonly stepsPerBeat: number;
    private readonly scheduleAheadTime: number;
    private readonly lookAheadMs: number;

    constructor() {
        this.audioCtx = null;
        this.masterGain = null;
        this.musicGain = null;
        this.drumGain = null;
        this.delayNode = null;
        this.delayFeedback = null;
        this.noiseBuffer = null;
        this.schedulerTimer = null;
        this.isPlaying = false;
        this.nextStepTime = 0;
        this.stepIndex = 0;
        this.tempo = 124;
        this.stepsPerBeat = 4;
        this.scheduleAheadTime = 0.2;
        this.lookAheadMs = 25;
    }

    public start = async (): Promise<void> => {
        if (this.isPlaying) {
            return;
        }

        this.ensureAudioGraph();
        if (!this.audioCtx || !this.masterGain) {
            return;
        }

        if (this.audioCtx.state !== "running") {
            await this.audioCtx.resume();
        }

        this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.masterGain.gain.setTargetAtTime(0.32, this.audioCtx.currentTime, 0.08);

        this.nextStepTime = this.audioCtx.currentTime + 0.08;
        this.stepIndex = 0;
        this.isPlaying = true;

        this.schedulerTimer = window.setInterval(() => {
            this.scheduler();
        }, this.lookAheadMs);
    }

    public stop = (): void => {
        if (!this.isPlaying) {
            return;
        }

        this.isPlaying = false;

        if (this.schedulerTimer !== null) {
            window.clearInterval(this.schedulerTimer);
            this.schedulerTimer = null;
        }

        if (this.audioCtx && this.masterGain) {
            this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
            this.masterGain.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.05);
        }
    }

    private ensureAudioGraph(): void {
        if (
            this.audioCtx &&
            this.masterGain &&
            this.musicGain &&
            this.drumGain &&
            this.delayNode &&
            this.delayFeedback &&
            this.noiseBuffer
        ) {
            return;
        }

        const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) {
            return;
        }

        this.audioCtx = new AudioCtx();
        this.masterGain = this.audioCtx.createGain();
        this.musicGain = this.audioCtx.createGain();
        this.drumGain = this.audioCtx.createGain();
        this.delayNode = this.audioCtx.createDelay(0.5);
        this.delayFeedback = this.audioCtx.createGain();

        this.masterGain.gain.value = 0;
        this.musicGain.gain.value = 0.88;
        this.drumGain.gain.value = 0.8;
        this.delayNode.delayTime.value = 0.24;
        this.delayFeedback.gain.value = 0.3;

        this.musicGain.connect(this.masterGain);
        this.drumGain.connect(this.masterGain);

        this.musicGain.connect(this.delayNode);
        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);
        this.delayNode.connect(this.masterGain);

        this.masterGain.connect(this.audioCtx.destination);

        this.noiseBuffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate, this.audioCtx.sampleRate);
        const channelData = this.noiseBuffer.getChannelData(0);
        for (let index = 0; index < channelData.length; index++) {
            channelData[index] = (Math.random() * 2) - 1;
        }
    }

    private scheduler(): void {
        if (!this.audioCtx || !this.isPlaying) {
            return;
        }

        while (this.nextStepTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
            this.scheduleStep(this.stepIndex, this.nextStepTime);
            this.nextStepTime = this.nextStepTime + this.getSecondsPerStep();
            this.stepIndex = (this.stepIndex + 1) % 32;
        }
    }

    private scheduleStep(step: number, when: number): void {
        this.playKick(step, when);
        this.playSnare(step, when);
        this.playHiHat(step, when);
        this.playBass(step, when);
        this.playPad(step, when);
        this.playLead(step, when);
    }

    private playKick(step: number, when: number): void {
        if (!this.audioCtx || !this.drumGain) {
            return;
        }

        if (step % 8 !== 0) {
            return;
        }

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, when);
        osc.frequency.exponentialRampToValueAtTime(45, when + 0.18);

        gain.gain.setValueAtTime(0.001, when);
        gain.gain.exponentialRampToValueAtTime(0.9, when + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, when + 0.2);

        osc.connect(gain);
        gain.connect(this.drumGain);
        osc.start(when);
        osc.stop(when + 0.21);
    }

    private playSnare(step: number, when: number): void {
        if (!this.audioCtx || !this.drumGain || !this.noiseBuffer) {
            return;
        }

        if (step % 16 !== 8) {
            return;
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const noiseFilter = this.audioCtx.createBiquadFilter();
        noiseFilter.type = "highpass";
        noiseFilter.frequency.value = 1700;

        const noiseGain = this.audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.001, when);
        noiseGain.gain.exponentialRampToValueAtTime(0.25, when + 0.005);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, when + 0.14);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.drumGain);

        const tone = this.audioCtx.createOscillator();
        tone.type = "triangle";
        tone.frequency.setValueAtTime(210, when);

        const toneGain = this.audioCtx.createGain();
        toneGain.gain.setValueAtTime(0.001, when);
        toneGain.gain.exponentialRampToValueAtTime(0.12, when + 0.008);
        toneGain.gain.exponentialRampToValueAtTime(0.001, when + 0.12);

        tone.connect(toneGain);
        toneGain.connect(this.drumGain);

        if (step % 16 === 12) {
            const clap = this.audioCtx.createBufferSource();
            clap.buffer = this.noiseBuffer;

            const clapFilter = this.audioCtx.createBiquadFilter();
            clapFilter.type = "bandpass";
            clapFilter.frequency.value = 2100;

            const clapGain = this.audioCtx.createGain();
            clapGain.gain.setValueAtTime(0.001, when + 0.015);
            clapGain.gain.exponentialRampToValueAtTime(0.12, when + 0.02);
            clapGain.gain.exponentialRampToValueAtTime(0.001, when + 0.085);

            clap.connect(clapFilter);
            clapFilter.connect(clapGain);
            clapGain.connect(this.drumGain);
            clap.start(when + 0.015);
            clap.stop(when + 0.09);
        }

        noise.start(when);
        noise.stop(when + 0.15);
        tone.start(when);
        tone.stop(when + 0.13);
    }

    private playHiHat(step: number, when: number): void {
        if (!this.audioCtx || !this.drumGain || !this.noiseBuffer) {
            return;
        }

        if (step % 2 !== 0) {
            return;
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const hp = this.audioCtx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 5000;

        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.001, when);
        gain.gain.exponentialRampToValueAtTime(0.08, when + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.001, when + 0.05);

        noise.connect(hp);
        hp.connect(gain);
        gain.connect(this.drumGain);

        noise.start(when);
        noise.stop(when + 0.055);
    }

    private playBass(step: number, when: number): void {
        if (!this.audioCtx || !this.musicGain) {
            return;
        }

        const bassPattern: Array<number | null> = [
            40, null, 40, 43, 45, null, 40, null,
            36, null, 36, 38, 40, null, 35, null,
            40, null, 40, 43, 45, null, 40, null,
            31, null, 35, 36, 38, null, 36, null
        ];

        const midi = bassPattern[step % bassPattern.length];
        if (midi === null) {
            return;
        }

        const osc = this.audioCtx.createOscillator();
        const subOsc = this.audioCtx.createOscillator();
        osc.type = "sawtooth";
        subOsc.type = "sine";
        osc.frequency.setValueAtTime(this.midiToFrequency(midi), when);
        subOsc.frequency.setValueAtTime(this.midiToFrequency(midi - 12), when);

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(420, when);
        filter.frequency.exponentialRampToValueAtTime(220, when + 0.2);
        filter.Q.value = 7;

        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.001, when);
        gain.gain.exponentialRampToValueAtTime(0.2, when + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, when + 0.24);

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(when);
        subOsc.start(when);
        osc.stop(when + 0.24);
        subOsc.stop(when + 0.24);
    }

    private playPad(step: number, when: number): void {
        if (!this.audioCtx || !this.musicGain) {
            return;
        }

        if (step % 16 !== 0) {
            return;
        }

        const bar = Math.floor(step / 16) % 2;
        const chord = bar === 0 ? [52, 55, 59] : [48, 52, 55];

        chord.forEach((midi: number, chordIndex: number) => {
            const osc = this.audioCtx!.createOscillator();
            const detuneOsc = this.audioCtx!.createOscillator();
            osc.type = "triangle";
            detuneOsc.type = "sawtooth";
            osc.frequency.setValueAtTime(this.midiToFrequency(midi), when);
            detuneOsc.frequency.setValueAtTime(this.midiToFrequency(midi) * 0.998, when);

            const filter = this.audioCtx!.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(1300 - (chordIndex * 150), when);
            filter.Q.value = 1.8;

            const gain = this.audioCtx!.createGain();
            gain.gain.setValueAtTime(0.001, when);
            gain.gain.exponentialRampToValueAtTime(0.07, when + 0.18);
            gain.gain.exponentialRampToValueAtTime(0.001, when + 0.95);

            osc.connect(filter);
            detuneOsc.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGain!);

            osc.start(when);
            detuneOsc.start(when);
            osc.stop(when + 1.0);
            detuneOsc.stop(when + 1.0);
        });
    }

    private playLead(step: number, when: number): void {
        if (!this.audioCtx || !this.musicGain) {
            return;
        }

        const leadPattern: Array<number | null> = [
            null, 64, 67, null, 71, null, 72, null,
            null, 71, 67, null, 64, null, 62, null,
            null, 64, 67, null, 71, null, 74, null,
            null, 72, 71, null, 67, null, 64, null
        ];

        const midi = leadPattern[step % leadPattern.length];
        if (midi === null) {
            return;
        }

        const oscA = this.audioCtx.createOscillator();
        const oscB = this.audioCtx.createOscillator();
        oscA.type = "square";
        oscB.type = "triangle";

        const freq = this.midiToFrequency(midi);
        oscA.frequency.setValueAtTime(freq, when);
        oscB.frequency.setValueAtTime(freq * 1.002, when);

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2400, when);
        filter.Q.value = 4;

        const pannerA = this.audioCtx.createStereoPanner();
        const pannerB = this.audioCtx.createStereoPanner();
        pannerA.pan.value = -0.18;
        pannerB.pan.value = 0.18;

        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.001, when);
        gain.gain.exponentialRampToValueAtTime(0.08, when + 0.014);
        gain.gain.exponentialRampToValueAtTime(0.001, when + 0.2);

        oscA.connect(pannerA);
        oscB.connect(pannerB);
        pannerA.connect(filter);
        pannerB.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        oscA.start(when);
        oscB.start(when);
        oscA.stop(when + 0.2);
        oscB.stop(when + 0.2);
    }

    private getSecondsPerStep(): number {
        return 60 / (this.tempo * this.stepsPerBeat);
    }

    private midiToFrequency(midi: number): number {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }
}
