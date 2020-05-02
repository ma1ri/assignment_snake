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


const sn = new Game();
const startButton = document.getElementsByClassName("start-button")[0];
const pauseButton = document.getElementsByClassName("pause-button")[0];
const stopButton = document.getElementsByClassName("stop-button")[0];
//saves setinterval timer
let myvar;

function buttonActionWrapper() {
    console.log("clicked");
    startButton.removeEventListener("click", buttonActionWrapper);
    sn.reset();
    startButtonAction();
}

function startButtonAction() {
    myvar = setInterval(() => {
        if (sn.play) {
            sn.move(result.dx, result.dy)
        } else {
            result.dx = 1;
            result.dy = 0;
            clearInterval(myvar);
            startButton.addEventListener("click", buttonActionWrapper, false);
        }
    }, 1000);
}


startButton.addEventListener("click", buttonActionWrapper, false);

pauseButton.addEventListener("click", () => {
    clearInterval(myvar);
    startButton.addEventListener("click", buttonActionWrapper, false);
});

stopButton.addEventListener("click", () => {
    clearInterval(myvar);
    sn.restart();
    startButton.addEventListener("click", buttonActionWrapper, false);
});


