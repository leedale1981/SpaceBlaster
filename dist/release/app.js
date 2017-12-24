/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class GameConfig {
}
GameConfig.canvasHeight = 720;
GameConfig.canvasWidth = 1280;
GameConfig.starDensity = 100;
exports.GameConfig = GameConfig;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GameObject_1 = __webpack_require__(2);
class Sprite extends GameObject_1.GameObject {
    constructor(ctx, options) {
        super(ctx);
        this.options = options;
    }
    render() {
        let self = this;
        self.ctx.drawImage(self.options.image, self.options.x, self.options.y, self.options.width, self.options.height);
    }
    moveLeft() {
        let self = this;
        self.options.x = self.options.x - (self.options.deltaX);
    }
    moveRight() {
        let self = this;
        self.options.x = self.options.x + self.options.deltaX;
    }
    moveForward() {
        let self = this;
        self.options.y = self.options.y - self.options.deltaYForward;
    }
    moveBack() {
        let self = this;
        if (self.options.y >= self.ctx.canvas.height) {
            self.options.y = 0;
        }
        else {
            self.options.y = self.options.y + self.options.deltaYBackward;
        }
    }
    swapImage(newImage) {
        this.options.image = newImage;
    }
    getXCoord() {
        let self = this;
        return self.options.x;
    }
    getYCoord() {
        let self = this;
        return self.options.y;
    }
}
exports.Sprite = Sprite;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class GameObject {
    constructor(ctx) {
        this.ctx = null;
        this.ctx = ctx;
    }
}
exports.GameObject = GameObject;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GameLoop_1 = __webpack_require__(4);
let canvas;
let ctx;
let gameLoop;
window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    gameLoop = new GameLoop_1.GameLoop(ctx);
    gameLoop.start();
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GameConfig_1 = __webpack_require__(0);
const GameObject_1 = __webpack_require__(2);
const KeyboardInput_1 = __webpack_require__(5);
const PlayerSpaceShip_1 = __webpack_require__(6);
const Star_1 = __webpack_require__(8);
class GameLoop extends GameObject_1.GameObject {
    constructor(ctx) {
        super(ctx);
        let self = this;
        self.setupBackgroundStars();
        self.playerSprite = new PlayerSpaceShip_1.PlayerSpaceShip(ctx);
        self.setupPlayerSpaceshipKeyboardInputs();
    }
    setupPlayerSpaceshipKeyboardInputs() {
        let self = this;
        this.keyboardInput = new KeyboardInput_1.KeyboardInput();
        this.keyboardInput.addKeycodeCallback(37, self.playerSprite.moveLeft.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(65, self.playerSprite.moveLeft.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(37, self.playerSprite.removeSkew.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(65, self.playerSprite.removeSkew.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(38, self.playerSprite.moveForward.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(87, self.playerSprite.moveForward.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(38, self.playerSprite.swapImageToNoThrust.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(87, self.playerSprite.swapImageToNoThrust.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(39, self.playerSprite.moveRight.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(68, self.playerSprite.moveRight.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(39, self.playerSprite.removeSkew.bind(self.playerSprite));
        this.keyboardInput.addKeycodeUpCallback(68, self.playerSprite.removeSkew.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(40, self.playerSprite.moveBack.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(83, self.playerSprite.moveBack.bind(self.playerSprite));
        this.keyboardInput.addKeycodeCallback(32, self.playerSprite.fireBullet.bind(self.playerSprite));
    }
    setupBackgroundStars() {
        let self = this;
        self.stars = [];
        for (let index = 0; index < GameConfig_1.GameConfig.starDensity; index++) {
            self.stars.push(new Star_1.Star(self.ctx));
        }
    }
    start() {
        window.requestAnimationFrame(this.start.bind(this));
        this.keyboardInput.inputLoop();
        this.clearCanvas();
        this.moveStars();
        this.renderPlayerSprite();
    }
    moveStars() {
        let self = this;
        self.stars.forEach((star) => {
            star.moveBack();
            star.render();
        });
    }
    clearCanvas() {
        let self = this;
        self.ctx.fillStyle = "black";
        self.ctx.fillRect(0, 0, GameConfig_1.GameConfig.canvasWidth, GameConfig_1.GameConfig.canvasHeight);
    }
    renderPlayerSprite() {
        let self = this;
        self.playerSprite.render();
    }
}
exports.GameLoop = GameLoop;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class KeyboardInput {
    constructor() {
        this.keyCallback = {};
        this.keyUpCallback = {};
        this.keyDown = {};
        this.keyUp = {};
        this.addKeycodeCallback = (keycode, f) => {
            this.keyCallback[keycode] = f;
            this.keyDown[keycode] = false;
        };
        this.addKeycodeUpCallback = (keycode, f) => {
            this.keyUpCallback[keycode] = f;
            this.keyUp[keycode] = false;
        };
        this.keyboardDown = (event) => {
            if (this.keyCallback[event.keyCode] != null) {
                event.preventDefault();
            }
            this.keyDown[event.keyCode] = true;
            this.keyUp[event.keyCode] = false;
        };
        this.keyboardUp = (event) => {
            this.keyUp[event.keyCode] = true;
            this.keyDown[event.keyCode] = false;
        };
        this.inputLoop = () => {
            for (var key in this.keyDown) {
                var is_down = this.keyDown[key];
                if (is_down) {
                    var callback = this.keyCallback[key];
                    if (callback != null) {
                        callback();
                    }
                }
            }
            for (var key in this.keyUp) {
                var is_up = this.keyUp[key];
                if (is_up) {
                    var callback = this.keyUpCallback[key];
                    if (callback != null) {
                        callback();
                        this.keyUp[key] = false;
                    }
                }
            }
        };
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }
}
exports.KeyboardInput = KeyboardInput;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Sprite_1 = __webpack_require__(1);
const GameConfig_1 = __webpack_require__(0);
const Bullet_1 = __webpack_require__(7);
class PlayerSpaceShip extends Sprite_1.Sprite {
    constructor(ctx) {
        let image = document.getElementById("player-spaceship");
        let width = 60;
        let height = 60;
        let initialX = (GameConfig_1.GameConfig.canvasWidth / 2) - (width / 2);
        let initialY = (GameConfig_1.GameConfig.canvasHeight - 50);
        let spriteOptions = {
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
        this.bullets = [];
        this.canFire = true;
    }
    swapImageToThrust() {
        let newImage = document.getElementById("player-spaceship-with-thrust");
        super.swapImage(newImage);
    }
    swapImageToNoThrust() {
        let image = document.getElementById("player-spaceship");
        super.swapImage(image);
    }
    moveForward() {
        let self = this;
        self.swapImageToThrust();
        super.moveForward();
    }
    moveLeft() {
        let self = this;
        self.skew();
        super.moveLeft();
    }
    moveRight() {
        let self = this;
        self.skew();
        super.moveRight();
    }
    moveBack() {
        let self = this;
        self.swapImageToNoThrust();
        super.moveBack();
    }
    fireBullet() {
        let self = this;
        if (self.canFire) {
            let bullet = new Bullet_1.Bullet(self.ctx, self);
            bullet.moveForward();
            self.bullets.push(bullet);
            self.canFire = false;
            setTimeout(() => {
                self.canFire = true;
            }, 300);
        }
    }
    skew() {
        let self = this;
        if (self.options.width > 40) {
            self.options.width = self.options.width / 1.1;
        }
    }
    removeSkew() {
        let self = this;
        self.options.width = 60;
    }
    render() {
        let self = this;
        self.bullets.forEach((bullet) => {
            bullet.render();
        });
        super.render();
    }
}
exports.PlayerSpaceShip = PlayerSpaceShip;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Sprite_1 = __webpack_require__(1);
class Bullet extends Sprite_1.Sprite {
    constructor(ctx, parentSprite) {
        let image = document.getElementById("player-bullet");
        let initialX = parentSprite.getXCoord() + 20;
        let initialY = parentSprite.getYCoord() - 20;
        let spriteOptions = {
            height: 20,
            width: 20,
            x: initialX,
            y: initialY,
            image: image,
            deltaX: 0,
            deltaYForward: 1,
            deltaYBackward: 1
        };
        super(ctx, spriteOptions);
    }
    moveForward() {
        let self = this;
        setTimeout(() => {
            if (self.options.y > 0) {
                self.options.y = self.options.y - self.options.deltaYForward;
                self.moveForward();
            }
        }, 5);
    }
}
exports.Bullet = Bullet;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Sprite_1 = __webpack_require__(1);
const GameConfig_1 = __webpack_require__(0);
class Star extends Sprite_1.Sprite {
    constructor(ctx) {
        let width = 2;
        let height = 2;
        let initialX = Math.floor(Math.random() * GameConfig_1.GameConfig.canvasWidth) + 1;
        let initialY = Math.floor(Math.random() * GameConfig_1.GameConfig.canvasHeight) + 1;
        let spriteOptions = {
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
    render() {
        let self = this;
        self.ctx.beginPath();
        self.ctx.strokeStyle = "white";
        self.ctx.lineWidth = self.options.width;
        self.ctx.arc(self.options.x, self.options.y, 1, 0, Math.PI);
        self.ctx.stroke();
    }
}
exports.Star = Star;


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map