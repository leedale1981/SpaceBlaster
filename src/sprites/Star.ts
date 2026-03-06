import { Sprite } from "./Sprite";
import * as SpriteOptions from "./SpriteOptions";

export class Star extends Sprite {
    private radius: number;
    private color: string;
    private driftX: number;

    constructor(ctx: CanvasRenderingContext2D) {
        const layerRoll = Math.random();

        let radius = 1;
        let speedY = 0.6;
        let driftX = 0;
        let color = "rgba(255, 255, 255, 0.55)";

        // Multi-layer starfield: tiny distant stars are slow, large near stars are faster.
        if (layerRoll > 0.86) {
            radius = 2.6;
            speedY = 2.1;
            driftX = (Math.random() - 0.5) * 0.18;
            color = "rgba(255, 255, 255, 0.95)";
        } else if (layerRoll > 0.58) {
            radius = 1.8;
            speedY = 1.4;
            driftX = (Math.random() - 0.5) * 0.1;
            color = "rgba(230, 245, 255, 0.75)";
        }

        const initialX: number = Math.random() * ctx.canvas.width;
        const initialY: number = Math.random() * ctx.canvas.height;
        const image: HTMLImageElement = <HTMLImageElement>document.getElementById("player-spaceship");

        const spriteOptions: SpriteOptions.SpriteOptions = {
            height: radius * 2,
            width: radius * 2,
            x: initialX,
            y: initialY,
            image: image,
            deltaX: 2,
            deltaYForward: 1,
            deltaYBackward: speedY
        };

        super(ctx, spriteOptions);
        this.radius = radius;
        this.color = color;
        this.driftX = driftX;
    }

    public moveBack(): void {
        this.options.y = this.options.y + this.options.deltaYBackward;
        this.options.x = this.options.x + this.driftX;

        if (this.options.y > this.ctx.canvas.height + this.radius) {
            this.options.y = -this.radius;
            this.options.x = Math.random() * this.ctx.canvas.width;
        }

        if (this.options.x > this.ctx.canvas.width + this.radius) {
            this.options.x = -this.radius;
        }

        if (this.options.x < -this.radius) {
            this.options.x = this.ctx.canvas.width + this.radius;
        }
    }

    public render(): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.options.x, this.options.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}