import { Sprite } from "./Sprite";
import * as SpriteOptions from "./SpriteOptions";

type Crater = {
    x: number;
    y: number;
    radius: number;
};

export class Asteroid extends Sprite {
    private readonly baseRadius: number;
    private readonly shapeOffsets: Array<number>;
    private readonly craters: Array<Crater>;
    private readonly rotationSpeed: number;
    private rotation: number;
    private health: number;

    constructor(ctx: CanvasRenderingContext2D, initialX: number, initialY: number, radius: number, speedY: number) {
        const image: HTMLImageElement = <HTMLImageElement>document.getElementById("player-spaceship");
        const spriteOptions: SpriteOptions.SpriteOptions = {
            height: radius * 2,
            width: radius * 2,
            x: initialX,
            y: initialY,
            image: image,
            deltaX: 0,
            deltaYForward: 0,
            deltaYBackward: speedY
        };

        super(ctx, spriteOptions);
        this.baseRadius = radius;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.012) + 0.003;
        this.health = 3;

        this.shapeOffsets = [];
        for (let index = 0; index < 16; index++) {
            this.shapeOffsets.push((Math.random() * 0.3) + 0.82);
        }

        this.craters = [];
        const craterCount = 4 + Math.floor(Math.random() * 3);
        for (let index = 0; index < craterCount; index++) {
            this.craters.push({
                x: (Math.random() - 0.5) * radius * 0.9,
                y: (Math.random() - 0.5) * radius * 0.9,
                radius: (Math.random() * (radius * 0.22)) + (radius * 0.08)
            });
        }
    }

    public render(): void {
        const radius = this.getCurrentRadius();
        const centerX = this.options.x + radius;
        const centerY = this.options.y + radius;
        this.rotation = this.rotation + this.rotationSpeed;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.rotation);

        const gradient = this.ctx.createRadialGradient(-radius * 0.25, -radius * 0.35, radius * 0.1, 0, 0, radius);
        gradient.addColorStop(0, "rgba(150, 150, 150, 0.95)");
        gradient.addColorStop(0.6, "rgba(98, 98, 98, 0.95)");
        gradient.addColorStop(1, "rgba(60, 60, 60, 0.96)");

        this.ctx.beginPath();
        for (let index = 0; index < this.shapeOffsets.length; index++) {
            const theta = (Math.PI * 2 * index) / this.shapeOffsets.length;
            const r = radius * this.shapeOffsets[index];
            const x = Math.cos(theta) * r;
            const y = Math.sin(theta) * r;

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = "rgba(35, 35, 35, 0.7)";
        this.ctx.lineWidth = Math.max(1, radius * 0.08);
        this.ctx.stroke();

        this.craters.forEach((crater: Crater) => {
            this.ctx.beginPath();
            this.ctx.fillStyle = "rgba(45, 45, 45, 0.45)";
            this.ctx.arc(crater.x, crater.y, crater.radius, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.strokeStyle = "rgba(180, 180, 180, 0.2)";
            this.ctx.lineWidth = 1;
            this.ctx.arc(crater.x - (crater.radius * 0.15), crater.y - (crater.radius * 0.15), crater.radius * 0.72, 0, Math.PI * 2);
            this.ctx.stroke();
        });

        this.ctx.restore();
    }

    public move(): void {
        this.options.y = this.options.y + this.options.deltaYBackward;
    }

    public registerHit(): void {
        if (this.health <= 0) {
            return;
        }

        this.health--;
        const sizeScale = Math.max(0.4, this.health / 3);
        const newRadius = this.baseRadius * sizeScale;
        this.options.width = newRadius * 2;
        this.options.height = newRadius * 2;
    }

    public applyBulletImpact(inertia: number): void {
        this.options.deltaYBackward = Math.max(0.25, this.options.deltaYBackward - (inertia * 0.18));
        this.registerHit();
    }

    public isDestroyed(): boolean {
        return this.health <= 0;
    }

    public isOffScreen(): boolean {
        return this.options.y > this.ctx.canvas.height + this.options.height;
    }

    private getCurrentRadius(): number {
        return this.options.width / 2;
    }
}
