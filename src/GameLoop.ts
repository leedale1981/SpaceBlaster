import { GameConfig } from "./GameConfig";
import { GameObject } from "./GameObject";
import { KeyboardInput } from "./KeyboardInput";
import { PlayerSpaceShip } from "./sprites/PlayerSpaceShip";
import { Star } from "./sprites/Star";
import { Level } from "./levels/Level";
import { LevelOne } from "./levels/LevelOne";

export class GameLoop extends GameObject {

    private playerSprite: PlayerSpaceShip;
    private keyboardInput: KeyboardInput;
    private stars: Array<Star>;
    private levels: Array<Level>;

    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
        let self = this;

        self.setupBackgroundStars();
        self.playerSprite = new PlayerSpaceShip(ctx);
        self.setupPlayerSpaceshipKeyboardInputs();
    }

    private setupPlayerSpaceshipKeyboardInputs() {
        let self = this;

        this.keyboardInput = new KeyboardInput();
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

    private setupBackgroundStars(): void {
        let self = this;
        self.stars = [];

        for (let index = 0; index < GameConfig.starDensity; index++) {
            self.stars.push(new Star(self.ctx));
        }
    }

    private setupLevels(): void {
        let self = this;
        self.levels = [];

        self.levels.push(new LevelOne());
    }

    public render(): void {
        window.requestAnimationFrame(this.render.bind(this));
        this.keyboardInput.inputLoop();
        this.clearCanvas();
        this.moveStars();
        this.renderPlayerSprite();
    }

    private moveStars(): void {
        let self = this;

        self.stars.forEach((star: Star) => {
            star.moveBack();
            star.render();
        });
    }

    private clearCanvas(): void {
        let self = this;

        self.ctx.fillStyle = "black";
        self.ctx.fillRect(0, 0, GameConfig.canvasWidth, GameConfig.canvasHeight);
    }

    private renderPlayerSprite(): void {
        let self = this;
        self.playerSprite.render();
    }
}