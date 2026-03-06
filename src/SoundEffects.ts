export class SoundEffects {
    private audioCtx: AudioContext | null;
    private masterGain: GainNode | null;
    private noiseBuffer: AudioBuffer | null;

    constructor() {
        this.audioCtx = null;
        this.masterGain = null;
        this.noiseBuffer = null;
    }

    public unlock = async (): Promise<void> => {
        this.ensureAudioGraph();

        if (!this.audioCtx) {
            return;
        }

        if (this.audioCtx.state !== "running") {
            await this.audioCtx.resume();
        }
    }

    public playExplosion = (): void => {
        this.ensureAudioGraph();
        if (!this.audioCtx || !this.masterGain || !this.noiseBuffer) {
            return;
        }

        const now = this.audioCtx.currentTime;

        const noiseSource = this.audioCtx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;

        const noiseFilter = this.audioCtx.createBiquadFilter();
        noiseFilter.type = "lowpass";
        noiseFilter.frequency.setValueAtTime(1800, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(260, now + 0.35);

        const noiseGain = this.audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.5, now + 0.008);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        const boomOsc = this.audioCtx.createOscillator();
        boomOsc.type = "triangle";
        boomOsc.frequency.setValueAtTime(170, now);
        boomOsc.frequency.exponentialRampToValueAtTime(45, now + 0.28);

        const boomGain = this.audioCtx.createGain();
        boomGain.gain.setValueAtTime(0.001, now);
        boomGain.gain.exponentialRampToValueAtTime(0.38, now + 0.01);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        boomOsc.connect(boomGain);
        boomGain.connect(this.masterGain);

        noiseSource.start(now);
        noiseSource.stop(now + 0.35);
        boomOsc.start(now);
        boomOsc.stop(now + 0.32);
    }

    public playRockBreak = (): void => {
        this.ensureAudioGraph();
        if (!this.audioCtx || !this.masterGain || !this.noiseBuffer) {
            return;
        }

        const now = this.audioCtx.currentTime;

        const crunch = this.audioCtx.createBufferSource();
        crunch.buffer = this.noiseBuffer;

        const band = this.audioCtx.createBiquadFilter();
        band.type = "bandpass";
        band.frequency.setValueAtTime(1400, now);
        band.Q.value = 1.2;

        const crunchGain = this.audioCtx.createGain();
        crunchGain.gain.setValueAtTime(0.001, now);
        crunchGain.gain.exponentialRampToValueAtTime(0.2, now + 0.003);
        crunchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

        crunch.connect(band);
        band.connect(crunchGain);
        crunchGain.connect(this.masterGain);

        const pebbleTone = this.audioCtx.createOscillator();
        pebbleTone.type = "square";
        pebbleTone.frequency.setValueAtTime(540, now);
        pebbleTone.frequency.exponentialRampToValueAtTime(220, now + 0.1);

        const pebbleGain = this.audioCtx.createGain();
        pebbleGain.gain.setValueAtTime(0.001, now);
        pebbleGain.gain.exponentialRampToValueAtTime(0.08, now + 0.004);
        pebbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        pebbleTone.connect(pebbleGain);
        pebbleGain.connect(this.masterGain);

        crunch.start(now);
        crunch.stop(now + 0.12);
        pebbleTone.start(now);
        pebbleTone.stop(now + 0.1);
    }

    private ensureAudioGraph(): void {
        if (this.audioCtx && this.masterGain && this.noiseBuffer) {
            return;
        }

        const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) {
            return;
        }

        this.audioCtx = new AudioCtx();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 0.55;
        this.masterGain.connect(this.audioCtx.destination);

        this.noiseBuffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate, this.audioCtx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let index = 0; index < data.length; index++) {
            data[index] = (Math.random() * 2) - 1;
        }
    }
}
