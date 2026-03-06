import { Sprite } from "./Sprite";
import * as SpriteOptions from "./SpriteOptions";

export class EnemyBullet extends Sprite {
    constructor(ctx: CanvasRenderingContext2D, parentSprite: Sprite, speed: number = 3) {
        const image: HTMLImageElement = <HTMLImageElement>document.getElementById("player-bullet");

        const initialX: number = parentSprite.getXCoord() + (parentSprite.getWidth() / 2) - 6;
        const initialY: number = parentSprite.getYCoord() + parentSprite.getHeight();

        const spriteOptions: SpriteOptions.SpriteOptions = {
            height: 14,
            width: 12,
            x: initialX,
            y: initialY,
            image: image,
            deltaX: 0,
            deltaYForward: 0,
            deltaYBackward: speed
        };

        super(ctx, spriteOptions);
    }

    public move(): void {
        this.moveBack();
    }

    public render(): void {
        const image = this.options.image;

        if (image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
            super.render();
            return;
        }

        this.ctx.fillStyle = "#ff6b6b";
        this.ctx.fillRect(this.getXCoord(), this.getYCoord(), this.getWidth(), this.getHeight());
    }

    public isAtEdge(): boolean {
        return this.getYCoord() >= this.ctx.canvas.height;
    }
}
