import { Wave } from "./Wave";

export class Level {
    public currentWave: Wave;
    public waves: Array<Wave>;
    public waveNumber: number;
}