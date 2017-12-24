export class GameObject {

    protected ctx: CanvasRenderingContext2D = null;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }
}