import { GameConfig } from "./GameConfig";
import { GameObject } from "./GameObject";
import { KeyboardInput } from "./KeyboardInput";
import { PlayerSpaceShip } from "./sprites/PlayerSpaceShip";
import { Star } from "./sprites/Star";
import { Level } from "./levels/Level";
import { LevelOne } from "./levels/LevelOne";
import { Sprite } from "./sprites/Sprite";

export class GameLoop extends GameObject {
    private playerSprite: PlayerSpaceShip;
    private keyboardInput: KeyboardInput;
    private stars: Array<Star>;
    private levels: Array<Level>;
    private sprites: Array<Sprite>;

    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);

        this.playerSprite = new PlayerSpaceShip(ctx);
        this.keyboardInput = new KeyboardInput();
        this.stars = [];
        this.levels = [];
        this.sprites = [this.playerSprite];
        this.setupBackgroundStars();
        this.setupPlayerSpaceshipKeyboardInputs();
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

    private setupLevels = () => {
        this.levels.push(new LevelOne());
    }

    public render = () => {
        window.requestAnimationFrame(this.render.bind(this));
        this.keyboardInput.inputLoop();
        this.clearCanvas();
        this.moveStars();

        for (let index = 0; index < this.sprites.length; index++) {
            let sprite = this.sprites[index];
            sprite.render();
        }

        this.detectCollisions();
    }

    private moveStars = () => {
        this.stars.forEach((star: Star) => {
            star.moveBack();
            star.render();
        });
    }

    private clearCanvas = () => {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, GameConfig.canvasWidth, GameConfig.canvasHeight);
    }

    private detectCollisions() {
        
    }
}