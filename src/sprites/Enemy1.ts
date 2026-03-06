import { Sprite } from "./Sprite";
import * as SpriteOptions from "./SpriteOptions";

export class Enemy1 extends Sprite {
    
    constructor(ctx: CanvasRenderingContext2D, initialX: number, initialY: number) {
        let image: HTMLImageElement = <HTMLImageElement>document.getElementById("enemy1-spaceship");
        let width: number = 45;
        let height: number = 30;

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
    }

    public moveForward(): void {
        super.moveBack();
    }

    public moveLeft = () => {
        this.skew();
        super.moveLeft();
    }

    public moveRight = () => {
        this.skew();
        super.moveRight();
    }

    public moveBack = () => {
        super.moveForward();
    }

    public move(): void {
        
    }

    public advanceTowardPlayer(targetX: number, horizontalStep: number, verticalStep: number): void {
        const enemyCenter = this.options.x + (this.options.width / 2);

        if (enemyCenter < targetX - horizontalStep) {
            this.options.x = this.options.x + horizontalStep;
        } else if (enemyCenter > targetX + horizontalStep) {
            this.options.x = this.options.x - horizontalStep;
        }

        // Push enemies down the screen toward the player.
        this.options.y = this.options.y + verticalStep;

        if (this.options.x < 0) {
            this.options.x = 0;
        }

        if (this.options.x + this.options.width > this.ctx.canvas.width) {
            this.options.x = this.ctx.canvas.width - this.options.width;
        }
    }

    public isOffScreen(): boolean {
        return this.options.y > this.ctx.canvas.height;
    }

    private skew = () => {
        if (this.options.width > 40) {
            this.options.width = this.options.width / 1.1;
        }
    }
}