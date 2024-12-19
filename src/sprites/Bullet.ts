import { Sprite } from "./Sprite";
import { GameConfig } from "../GameConfig";
import * as SpriteOptions from "./SpriteOptions";

export class Bullet extends Sprite {
    private parentSprite: Sprite;

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
        let self = this;

        setTimeout(() => {
            if (self.options.y > 0) {
                self.options.y = self.options.y - self.options.deltaYForward;
                self.moveForward();
            }
        }, 5);
    }
}