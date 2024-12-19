export class KeyboardInput {

    public keyCallback: { [keycode: number]: () => void; } = {};
    public keyUpCallback: { [keycode: number]: () => void; } = {};
    public keyDown: { [keycode: number]: boolean; } = {};
    public keyUp: {[keycode: number]: boolean; } = {};

    constructor() {
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }

    public addKeycodeCallback = (keycode: number, f: () => void): void => {
        this.keyCallback[keycode] = f;
        this.keyDown[keycode] = false;
    }

    public addKeycodeUpCallback = (keycode: number, f: () => void): void => {
        this.keyUpCallback[keycode] = f;
        this.keyUp[keycode] = false;
    }

    public keyboardDown = (event: KeyboardEvent): void => {
        if (this.keyCallback[event.keyCode] != null) {
            event.preventDefault();
        }
        this.keyDown[event.keyCode] = true;
        this.keyUp[event.keyCode] = false;
    }

    public keyboardUp = (event: KeyboardEvent): void => {
        this.keyUp[event.keyCode] = true;
        this.keyDown[event.keyCode] = false;
    }

    public inputLoop = (): void => {
        for (var key in this.keyDown) {
            var is_down: boolean = this.keyDown[key];

            if (is_down) {
                var callback: () => void = this.keyCallback[key];
                if (callback != null) {
                    callback();
                }
            }
        }

        for (var key in this.keyUp) {
            var is_up: boolean = this.keyUp[key];

            if (is_up) {
                var callback: () => void = this.keyUpCallback[key];
                if (callback != null) {
                    callback();
                    this.keyUp[key] = false;
                }
            }
        }
    }
}