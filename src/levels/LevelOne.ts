import { CollisionSummary, Level } from "./Level";
import { Wave, WaveConfig } from "./Wave";
import { PlayerSpaceShip } from "../sprites/PlayerSpaceShip";

export class LevelOne extends Level {
    private waves: Array<Wave>;
    private waveIndex: number;
    private levelNumber: number;
    private waveTransitionDelayFrames: number;
    private waveTransitionCounter: number;

    constructor(ctx: CanvasRenderingContext2D, levelNumber: number) {
        super();
        this.levelNumber = levelNumber;
        this.waves = this.setupWaves(ctx);
        this.waveIndex = 0;
        this.waveTransitionDelayFrames = 75;
        this.waveTransitionCounter = 0;
    }

    public render(player: PlayerSpaceShip): void {
        if (!this.isStarted() || this.completed) {
            return;
        }

        if (this.waveTransitionCounter > 0) {
            this.waveTransitionCounter--;
            return;
        }

        const currentWave = this.waves[this.waveIndex];
        if (!currentWave) {
            this.completed = true;
            return;
        }

        currentWave.render(player);

        if (currentWave.isCompleted()) {
            this.waveIndex++;
            if (this.waveIndex >= this.waves.length) {
                this.completed = true;
            } else {
                this.waveTransitionCounter = this.waveTransitionDelayFrames;
            }
        }
    }

    public detectCollisions(player: PlayerSpaceShip): CollisionSummary {
        if (!this.isStarted() || this.completed) {
            return {
                enemiesDestroyed: 0,
                asteroidsDestroyed: 0,
                playerHit: false
            };
        }

        const currentWave = this.waves[this.waveIndex];
        if (currentWave) {
            return currentWave.detectCollisions(player);
        }

        return {
            enemiesDestroyed: 0,
            asteroidsDestroyed: 0,
            playerHit: false
        };
    }

    private setupWaves(ctx: CanvasRenderingContext2D): Array<Wave> {
        const wavesPerLevel = 5;
        const shootCooldown = Math.max(35, 100 - ((this.levelNumber - 1) * 5));
        const enemyBulletSpeed = 2 + ((this.levelNumber - 1) * 0.35);
        const waveConfigs: Array<WaveConfig> = [];

        for (let waveNumber = 1; waveNumber <= wavesPerLevel; waveNumber++) {
            waveConfigs.push({
                columns: 1 + waveNumber,
                rows: 1,
                startY: -40,
                startDelay: Math.max(40, 95 - (waveNumber * 8)),
                shootCooldown: shootCooldown,
                enemyBulletSpeed: enemyBulletSpeed,
                levelNumber: this.levelNumber,
                waveNumber: waveNumber
            });
        }

        return waveConfigs.map((waveConfig: WaveConfig) => new Wave(ctx, waveConfig));
    }
}