import { GameLoop } from "./GameLoop";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let gameLoop: GameLoop;

window.onload = () => {
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    gameLoop = new GameLoop(ctx);
    gameLoop.start();
}
