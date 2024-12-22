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

    private skew = () => {
        if (this.options.width > 40) {
            this.options.width = this.options.width / 1.1;
        }
    }
}