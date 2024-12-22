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
            deltaX: 4,
            deltaYForward: 5,
            deltaYBackward: 3
        };

        super(ctx, spriteOptions);
        this.bullets = [];
        this.canFire = true;
    }

    public swapImageToThrust = () => {
        let newImage: HTMLImageElement = <HTMLImageElement>document.getElementById("player-spaceship-with-thrust");
        super.swapImage(newImage);
    }

    public swapImageToNoThrust = () => {
        let image: HTMLImageElement = <HTMLImageElement>document.getElementById("player-spaceship");
        super.swapImage(image);
    }

    public moveForward = () => {
        this.swapImageToThrust();
        if (this.getYCoord() >= 0) {
            super.moveForward();
        }
    }

    public moveLeft = () => {
        this.skew();

        if (this.getXCoord() >= 0) {
            super.moveLeft();
        }
    }

    public moveRight = () => {
        this.skew();

        if (this.getXCoord() + this.options.width <= this.ctx.canvas.width) {
            super.moveRight();
        }
    }

    public moveBack = () => {
        this.swapImageToNoThrust();

        if (this.getYCoord() + this.options.height <= this.ctx.canvas.height) {
            super.moveBack();
        }
    }

    public fireBullet = () => {
        if (this.canFire) {
            let bullet: Bullet = new Bullet(this.ctx, this);
            bullet.moveForward();
            this.bullets.push(bullet);
            this.canFire = false;
            
            setTimeout(() => {
                this.canFire = true;
            }, 300);
        }
    }

    private skew = () => {
        if (this.options.width > 40) {
            this.options.width = this.options.width / 1.1;
        }
    }

    public removeSkew = () => {
        this.options.width = 60;
    }

    public render() {
        this.bullets.forEach((bullet: Bullet) => {
            bullet.render();
        });

        this.detectBulletsAtEdge();
        super.render();
    }

    private detectBulletsAtEdge() {
        for (let index = 0; index < this.bullets.length; index++) {
            let bullet: Bullet = this.bullets[index];
            if (bullet.isAtEdge()) {
                this.removeBullet(index);
            }
        }
    }

    private removeBullet(removeIndex: number) {
        let newBullets = new Array<Bullet>();
        for (let index = 0; index < this.bullets.length; index++) {
            if (index != removeIndex) {
                newBullets.push(this.bullets[index]);
            }
        }

        this.bullets = newBullets;
    }
}
