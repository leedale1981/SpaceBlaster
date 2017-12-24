import { Sprite } from "./Sprite";
import { GameConfig } from "../GameConfig";
import { Bullet } from "./Bullet";
import * as SpriteOptions from "./SpriteOptions";

export class PlayerSpaceShip extends Sprite {

    private bullets: Array<Bullet>;
    private canFire: boolean;

    constructor(ctx: CanvasRenderingContext2D) { 
        let image: HTMLImageElement = <HTMLImageElement>document.getElementById("player-spaceship");
        let width: number = 60;
        let height: number = 60;
        let initialX: number = (GameConfig.canvasWidth / 2) - (width / 2);
        let initialY: number = (GameConfig.canvasHeight - 50);

        let spriteOptions: SpriteOptions.SpriteOptions = {
            height: height,
            width: width,
            x: initialX,
            y: initialY,
            image: image,
            deltaX: 2,
            deltaYForward: 5,
            deltaYBackward: 3
        };

        super(ctx, spriteOptions);
        this.bullets = [];
        this.canFire = true;
    }

    public swapImageToThrust() {
        let newImage: HTMLImageElement = <HTMLImageElement>document.getElementById("player-spaceship-with-thrust");
        super.swapImage(newImage);
    }

    public swapImageToNoThrust() {
        let image: HTMLImageElement = <HTMLImageElement>document.getElementById("player-spaceship");
        super.swapImage(image);
    }

    public moveForward(): void {
        let self = this;
        self.swapImageToThrust();
        super.moveForward();
    }

    public moveLeft(): void {
        let self = this;
        self.skew();
        super.moveLeft();
    }

    public moveRight(): void {
        let self = this;
        self.skew();
        super.moveRight();
    }

    public moveBack(): void {
        let self = this;
        self.swapImageToNoThrust();
        super.moveBack();
    }

    public fireBullet() {
        let self = this;

        if (self.canFire) {
            let bullet: Bullet = new Bullet(self.ctx, self);
            bullet.moveForward();
            self.bullets.push(bullet);
            self.canFire = false;
            
            setTimeout(() => {
                self.canFire = true;
            }, 300);
        }
    }

    private skew(): void {
        let self = this;

        if (self.options.width > 40) {
            self.options.width = self.options.width / 1.1;
        }
    }

    public removeSkew(): void {
        let self = this;
        self.options.width = 60;
    }

    public render(): void {
        let self = this;
        
        self.bullets.forEach((bullet: Bullet) => {
            bullet.render();
        });

        super.render();
    }
}
