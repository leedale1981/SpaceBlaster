import { Sprite } from "./Sprite";
import { GameConfig } from "../GameConfig";
import { Bullet } from "./Bullet";
import * as SpriteOptions from "./SpriteOptions";

export class PlayerSpaceShip extends Sprite {

    private bullets: Array<Bullet>;
    private canFire: boolean;
    private explosionFramesRemaining: number;
    private respawnFramesRemaining: number;
    private invulnerableFramesRemaining: number;

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
        this.explosionFramesRemaining = 0;
        this.respawnFramesRemaining = 0;
        this.invulnerableFramesRemaining = 0;
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
        if (!this.canControl()) {
            return;
        }

        this.swapImageToThrust();
        if (this.getYCoord() >= 0) {
            super.moveForward();
        }
    }

    public moveLeft = () => {
        if (!this.canControl()) {
            return;
        }

        this.skew();

        if (this.getXCoord() >= 0) {
            super.moveLeft();
        }
    }

    public moveRight = () => {
        if (!this.canControl()) {
            return;
        }

        this.skew();

        if (this.getXCoord() + this.options.width <= this.ctx.canvas.width) {
            super.moveRight();
        }
    }

    public moveBack = () => {
        if (!this.canControl()) {
            return;
        }

        this.swapImageToNoThrust();

        if (this.getYCoord() + this.options.height <= this.ctx.canvas.height) {
            super.moveBack();
        }
    }

    public fireBullet = () => {
        if (this.canFire && this.canControl()) {
            let bullet: Bullet = new Bullet(this.ctx, this);
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
            bullet.moveForward();
            bullet.render();
        });

        this.detectBulletsAtEdge();

        if (this.explosionFramesRemaining > 0) {
            this.renderExplosion();
            this.explosionFramesRemaining--;

            if (this.explosionFramesRemaining === 0) {
                this.respawnFramesRemaining = 45;
                this.resetToSpawnPosition();
            }

            return;
        }

        if (this.respawnFramesRemaining > 0) {
            this.respawnFramesRemaining--;
        }

        if (this.invulnerableFramesRemaining > 0) {
            this.invulnerableFramesRemaining--;
            if (this.invulnerableFramesRemaining % 8 < 4) {
                return;
            }
        }

        super.render();
    }

    public handleHit(): void {
        if (this.isInvulnerable() || this.explosionFramesRemaining > 0) {
            return;
        }

        this.bullets = [];
        this.explosionFramesRemaining = 24;
        this.respawnFramesRemaining = 0;
        this.invulnerableFramesRemaining = 120;
    }

    public isInvulnerable(): boolean {
        return this.invulnerableFramesRemaining > 0 || this.explosionFramesRemaining > 0;
    }

    public getBullets(): Array<Bullet> {
        return this.bullets;
    }

    public removeBulletByReference(removeBullet: Bullet): void {
        this.bullets = this.bullets.filter((bullet: Bullet) => {
            return bullet !== removeBullet;
        });
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

    private canControl(): boolean {
        return this.explosionFramesRemaining === 0 && this.respawnFramesRemaining === 0;
    }

    private resetToSpawnPosition(): void {
        const spawnX = (this.ctx.canvas.width / 2) - (this.options.width / 2);
        const spawnY = this.ctx.canvas.height - this.options.height - 20;
        this.options.x = spawnX;
        this.options.y = spawnY;
        this.swapImageToNoThrust();
        this.removeSkew();
    }

    private renderExplosion(): void {
        const centerX = this.getXCoord() + (this.getWidth() / 2);
        const centerY = this.getYCoord() + (this.getHeight() / 2);
        const progress = 1 - (this.explosionFramesRemaining / 24);
        const radius = 8 + (progress * 34);

        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255, 180, 60, 0.75)";
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255, 80, 30, 0.65)";
        this.ctx.arc(centerX, centerY, radius * 0.55, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
