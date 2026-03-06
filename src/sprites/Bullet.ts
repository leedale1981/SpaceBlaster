import { Sprite } from "./Sprite";
import * as SpriteOptions from "./SpriteOptions";

export class Bullet extends Sprite {

    constructor(ctx: CanvasRenderingContext2D, parentSprite: Sprite) { 
        let image: HTMLImageElement = <HTMLImageElement>document.getElementById("player-bullet");

        let initialX: number = parentSprite.getXCoord() + 20;
        let initialY: number = parentSprite.getYCoord() - 20;

        let spriteOptions: SpriteOptions.SpriteOptions = {
            height: 20,
            width: 20,
            x: initialX,
            y: initialY,
            image: image,
            deltaX: 0,
            deltaYForward: 1,
            deltaYBackward: 1
        };

        super(ctx, spriteOptions);
    }

    public moveForward() {
        if (this.options.y > 0) {
            this.options.y = this.options.y - this.options.deltaYForward;
        }
    }

    public render(): void {
        const image = this.options.image;

        if (image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
            super.render();
            return;
        }

        this.ctx.fillStyle = "#f5f55a";
        this.ctx.fillRect(this.getXCoord(), this.getYCoord(), this.getWidth(), this.getHeight());
    }
    
    public isAtEdge(): boolean {
        return this.getYCoord() <= 0;
    }

    public getInertia(): number {
        return Math.max(1, this.options.deltaYForward * this.getWidth() * 0.08);
    }
}