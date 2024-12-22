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
    
    public render() {
        this.ctx.drawImage(
            this.options.image, 
            this.options.x, 
            this.options.y, 
            this.options.width, 
            this.options.height);
    }

    public moveLeft() {
        this.options.x =  this.options.x - (this.options.deltaX);
    }

    public moveRight() {
        this.options.x =  this.options.x + this.options.deltaX;
    }

    public moveForward() {
        let self = this;
        self.options.y =  self.options.y - self.options.deltaYForward;
    }

    public moveBack() {
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

    public collisionDetected() {
        
    }
}