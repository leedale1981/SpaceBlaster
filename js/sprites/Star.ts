import { Sprite } from "./Sprite";
import { GameConfig } from "../GameConfig";
import * as SpriteOptions from "./SpriteOptions";

export class Star extends Sprite {

    constructor(ctx: CanvasRenderingContext2D) {
        let width: number = 2;
        let height: number = 2;
        let initialX: number = Math.floor(Math.random() * GameConfig.canvasWidth) + 1;
        let initialY: number = Math.floor(Math.random() * GameConfig.canvasHeight) + 1;

        let spriteOptions: SpriteOptions.SpriteOptions = {
            height: height,
            width: width,
            x: initialX,
            y: initialY,
            image: null,
            deltaX: 2,
            deltaYForward: 1,
            deltaYBackward: 2
        };

        super(ctx, spriteOptions);
    }

    public render(): void {
        let self = this;
        
        self.ctx.beginPath();
        self.ctx.strokeStyle = "white";
        self.ctx.lineWidth = self.options.width;
        self.ctx.arc(self.options.x, self.options.y, 1, 0, Math.PI);
        self.ctx.stroke();
    }
}