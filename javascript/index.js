import { Game } from './game.js';

// **************************************
const left = 37;
const up = 38;
const right = 39;
const down = 40;
let result = { dx: 1, dy: 0 };

function getDirection(event) {
    switch (event.keyCode) {
        case left:
            result.dx = -1;
            result.dy = 0;
            break;
        case up:
            result.dx = 0;
            result.dy = -1;
            break;
        case right:
            result.dx = 1;
            result.dy = 0;
            break;
        case down:
            result.dx = 0;
            result.dy = 1;
            break;

    }
}



document.addEventListener("keydown", (event) => { getDirection(event) });
// *************************************************

const startButton = document.getElementsByClassName("start-button")[0];
const sn = new Game();

const pauseButton = document.getElementsByClassName("pause-button")[0];

// start pause
let myvar;
startButton.addEventListener("click", () => myvar = setInterval(() => { sn.move(result.dx, result.dy) }, 1000));

pauseButton.addEventListener("click", () => clearInterval(myvar));


