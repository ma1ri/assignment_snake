import { Game } from './game.js';

// **************************************
const left = 37;
const up = 38;
const right = 39;
const down = 40;
let direction = { dx: 1, dy: 0 };

function getDirection(event) {
    switch (event.keyCode) {
        case left:
            direction.dx = -1;
            direction.dy = 0;
            break;
        case up:
            direction.dx = 0;
            direction.dy = -1;
            break;
        case right:
            direction.dx = 1;
            direction.dy = 0;
            break;
        case down:
            direction.dx = 0;
            direction.dy = 1;
            break;

    }
}


document.addEventListener("keydown", (event) => { getDirection(event) });


const snake = new Game();
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");
//saves setinterval timer
let myvar;

function buttonActionWrapper() {
    console.log("clicked");
    startButton.removeEventListener("click", buttonActionWrapper);
    snake.reset();
    startButtonAction();
}

function startButtonAction() {
    myvar = setInterval(() => {
        if (snake.play) {
            snake.move(direction.dx, direction.dy)
        } else {
            direction.dx = 1;
            direction.dy = 0;
            clearInterval(myvar);
            startButton.addEventListener("click", buttonActionWrapper, false);
        }
    }, 100);
}


startButton.addEventListener("click", buttonActionWrapper, false);

pauseButton.addEventListener("click", () => {
    clearInterval(myvar);
    startButton.addEventListener("click", buttonActionWrapper, false);
});

stopButton.addEventListener("click", () => {
    clearInterval(myvar);
    snake.restart();
    startButton.addEventListener("click", buttonActionWrapper, false);
});


