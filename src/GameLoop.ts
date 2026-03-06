import { GameConfig } from "./GameConfig";
import { GameObject } from "./GameObject";
import { KeyboardInput } from "./KeyboardInput";
import { PlayerSpaceShip } from "./sprites/PlayerSpaceShip";
import { Star } from "./sprites/Star";
import { CollisionSummary, Level } from "./levels/Level";
import { LevelOne } from "./levels/LevelOne";
import { Sprite } from "./sprites/Sprite";
import { SynthMusic } from "./SynthMusic";
import { SoundEffects } from "./SoundEffects";

export class GameLoop extends GameObject {
    private playerSprite: PlayerSpaceShip;
    private keyboardInput: KeyboardInput;
    private stars: Array<Star>;
    private currentLevel: Level;
    private sprites: Array<Sprite>;
    private score: number;
    private lives: number;
    private gameOver: boolean;
    private gameWon: boolean;
    private currentLevelNumber: number;
    private readonly maxLevel: number;
    private music: SynthMusic;
    private soundEffects: SoundEffects;
    private musicStarted: boolean;

    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);

        this.playerSprite = new PlayerSpaceShip(ctx);
        this.keyboardInput = new KeyboardInput();
        this.stars = [];
        this.currentLevelNumber = 1;
        this.maxLevel = 10;
        this.currentLevel = new LevelOne(this.ctx, this.currentLevelNumber);
        this.sprites = [this.playerSprite];
        this.score = 0;
        this.lives = 10;
        this.gameOver = false;
        this.gameWon = false;
        this.music = new SynthMusic();
        this.soundEffects = new SoundEffects();
        this.musicStarted = false;
        this.setupBackgroundStars();
        this.setupPlayerSpaceshipKeyboardInputs();
        this.setupLevel();
        this.setupMusicStartListener();
    }

    private setupPlayerSpaceshipKeyboardInputs = () => {
        let self = this;

        this.keyboardInput.addKeycodeCallback(37, self.playerSprite.moveLeft.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(65, self.playerSprite.moveLeft.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(37, self.playerSprite.removeSkew.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(65, self.playerSprite.removeSkew.bind(self.playerSprite));

        this.keyboardInput.addKeycodeCallback(38, self.playerSprite.moveForward.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(87, self.playerSprite.moveForward.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(38, self.playerSprite.swapImageToNoThrust.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(87, self.playerSprite.swapImageToNoThrust.bind(self.playerSprite));

        this.keyboardInput.addKeycodeCallback(39, self.playerSprite.moveRight.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(68, self.playerSprite.moveRight.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(39, self.playerSprite.removeSkew.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(68, self.playerSprite.removeSkew.bind(self.playerSprite));

        this.keyboardInput.addKeycodeCallback(40, self.playerSprite.moveBack.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(83, self.playerSprite.moveBack.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(32, self.playerSprite.fireBullet.bind(self.playerSprite));
    }

    private setupBackgroundStars = () => {
        let self = this;

        for (let index = 0; index < GameConfig.starDensity; index++) {
            self.stars.push(new Star(this.ctx));
        }
    }

    private setupLevel = () => {
        this.currentLevel.start();
    }

    public render = () => {
        window.requestAnimationFrame(this.render.bind(this));

        if (!this.isGameFinished()) {
            this.keyboardInput.startInputLoop();
        } else {
            this.music.stop();
        }

        this.clearCanvas();

        if (!this.isGameFinished()) {
            this.moveStars();
        } else {
            this.stars.forEach((star: Star) => {
                star.render();
            });
        }

        for (let index = 0; index < this.sprites.length; index++) {
            let sprite = this.sprites[index];
            sprite.render();
        }

        if (!this.isGameFinished()) {
            this.currentLevel.render(this.playerSprite);
            this.detectCollisions();
            this.progressLevels();
        }

        this.renderHud();

        if (this.gameOver) {
            this.renderGameOverMessage();
        }

        if (this.gameWon) {
            this.renderWinMessage();
        }
    }

    private moveStars = () => {
        this.stars.forEach((star: Star) => {
            star.moveBack();
            star.render();
        });
    }

    private clearCanvas = () => {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    private renderHud = () => {
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 24px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`Score: ${this.score}`, 20, 36);
        this.ctx.fillText(`Level: ${this.currentLevelNumber}`, 20, 66);

        this.ctx.fillStyle = "#ff4d4d";
        this.ctx.textAlign = "right";
        this.ctx.fillText(`${"❤".repeat(this.lives)}`, this.ctx.canvas.width - 20, 36);
    }

    private renderGameOverMessage = () => {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.fillStyle = "#ff5c5c";
        this.ctx.font = "bold 64px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("GAME OVER", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 26px Arial";
        this.ctx.fillText(`Final Score: ${this.score}`, this.ctx.canvas.width / 2, (this.ctx.canvas.height / 2) + 48);
    }

    private renderWinMessage = () => {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.fillStyle = "#7CFF6B";
        this.ctx.font = "bold 56px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("YOU WIN", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 26px Arial";
        this.ctx.fillText(`Final Score: ${this.score}`, this.ctx.canvas.width / 2, (this.ctx.canvas.height / 2) + 48);
    }

    private detectCollisions() {
        const collisionSummary: CollisionSummary = this.currentLevel.detectCollisions(this.playerSprite);

        if (collisionSummary.enemyScoreGained > 0) {
            this.score = this.score + collisionSummary.enemyScoreGained;
            this.soundEffects.playExplosion();
        }

        if (collisionSummary.asteroidHits > 0) {
            this.soundEffects.playRockBreak();
        }

        if (collisionSummary.asteroidsDestroyed > 0) {
            this.score = this.score + (collisionSummary.asteroidsDestroyed * 200);
        }

        if (collisionSummary.playerHit) {
            this.playerSprite.handleHit();
            this.soundEffects.playExplosion();
            this.score = this.score - 100;
            this.lives = Math.max(0, this.lives - 1);

            if (this.lives === 0) {
                this.gameOver = true;
            }
        }
    }

    private progressLevels(): void {
        if (!this.currentLevel.isCompleted()) {
            return;
        }

        if (this.currentLevelNumber >= this.maxLevel) {
            this.gameWon = true;
            return;
        }

        this.currentLevelNumber++;
        this.currentLevel = new LevelOne(this.ctx, this.currentLevelNumber);
        this.currentLevel.start();
    }

    private isGameFinished(): boolean {
        return this.gameOver || this.gameWon;
    }

    private setupMusicStartListener(): void {
        const startMusic = () => {
            if (this.musicStarted) {
                return;
            }

            this.musicStarted = true;
            this.music.start();
            this.soundEffects.unlock();
        };

        window.addEventListener("keydown", startMusic, { once: true });
        window.addEventListener("mousedown", startMusic, { once: true });
        window.addEventListener("touchstart", startMusic, { once: true });
    }
}