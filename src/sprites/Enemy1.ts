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

    public moveForward(): void {
        let self = this;
        super.moveBack();
    }

    public moveLeft(): void {
        let self = this;
        self.skew();
        super.moveLeft();
    }

    public moveRight(): void {
        let self = this;
        self.skew();
        super.moveRight();
    }

    public moveBack(): void {
        let self = this;
        super.moveForward();
    }

    public move(): void {
        
    }

    private skew(): void {
        let self = this;

        if (self.options.width > 40) {
            self.options.width = self.options.width / 1.1;
        }
    }
}