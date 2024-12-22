import { GameLoop } from "./GameLoop";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let gameLoop: GameLoop;

window.onload = () => {
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    if (ctx != null) {
        gameLoop = new GameLoop(ctx);
        gameLoop.render();
    }
}
