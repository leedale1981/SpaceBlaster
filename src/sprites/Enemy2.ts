import { Sprite } from "./Sprite";
import * as SpriteOptions from "./SpriteOptions";

export class Enemy2 extends Sprite {
    private thrustActive: boolean;

    constructor(ctx: CanvasRenderingContext2D, initialX: number, initialY: number) {
        const image: HTMLImageElement = <HTMLImageElement>document.getElementById("enemy2-spaceship");

        const spriteOptions: SpriteOptions.SpriteOptions = {
            height: 54,
            width: 78,
            x: initialX,
            y: initialY,
            image: image,
            deltaX: 1.4,
            deltaYForward: 5,
            deltaYBackward: 2.2
        };

        super(ctx, spriteOptions);
        this.thrustActive = false;
    }

    public render(): void {
        if (this.thrustActive) {
            this.renderBoostFire();
        }

        super.render();
        this.thrustActive = false;
    }

    public advanceTowardPlayer(targetX: number, horizontalStep: number, verticalStep: number): void {
        this.thrustActive = verticalStep > 0;
        const enemyCenter = this.options.x + (this.options.width / 2);

        if (enemyCenter < targetX - horizontalStep) {
            this.options.x = this.options.x + horizontalStep;
        } else if (enemyCenter > targetX + horizontalStep) {
            this.options.x = this.options.x - horizontalStep;
        }

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

    private renderBoostFire(): void {
        const leftNozzleX = this.options.x + (this.options.width * 0.35);
        const rightNozzleX = this.options.x + (this.options.width * 0.65);
        const baseY = this.options.y - 1;

        this.renderSingleFlame(leftNozzleX, baseY, 14);
        this.renderSingleFlame(rightNozzleX, baseY, 14);
    }

    private renderSingleFlame(x: number, baseY: number, length: number): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255, 188, 88, 0.84)";
        this.ctx.moveTo(x - 5, baseY);
        this.ctx.lineTo(x + 5, baseY);
        this.ctx.lineTo(x, baseY - length);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255, 105, 45, 0.72)";
        this.ctx.moveTo(x - 3, baseY);
        this.ctx.lineTo(x + 3, baseY);
        this.ctx.lineTo(x, baseY - (length * 0.55));
        this.ctx.closePath();
        this.ctx.fill();
    }
}
