import { GameObject } from "../GameObject";
import { SpriteOptions } from "./SpriteOptions";

export class Sprite extends GameObject {

    protected options: SpriteOptions;

    constructor(
        ctx: CanvasRenderingContext2D,
        options: SpriteOptions) {
            
        super(ctx);
        this.options = options;
    }
    
    public render(): void {
        let self = this;

        self.ctx.drawImage(
            self.options.image, 
            self.options.x, 
            self.options.y, 
            self.options.width, 
            self.options.height);
    }

    public moveLeft(): void {
        let self = this;
        self.options.x =  self.options.x - (self.options.deltaX);
    }

    public moveRight(): void {
        let self = this;
        self.options.x =  self.options.x + self.options.deltaX;
    }

    public moveForward(): void {
        let self = this;
        self.options.y =  self.options.y - self.options.deltaYForward;
    }

    public moveBack() : void {
        let self = this;

        if (self.options.y >= self.ctx.canvas.height) {
            self.options.y = 0;
        } else {
            self.options.y =  self.options.y + self.options.deltaYBackward;
        }
    }

    public swapImage(newImage: HTMLImageElement): void {
        this.options.image = newImage;
    }

    public getXCoord(): number {
        let self = this;
        return self.options.x;
    }

    public getYCoord(): number {
        let self = this;
        return self.options.y;
    }
}