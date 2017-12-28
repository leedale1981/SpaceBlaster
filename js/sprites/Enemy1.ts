import { Sprite } from "./Sprite";
import { GameConfig } from "../GameConfig";
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
}