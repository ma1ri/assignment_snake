import { Game } from './game.js';


const snake = new Game();
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");
document.addEventListener("keydown", (event) => { snake.getDirection(event) });

//saves setinterval timer
let myvar;

function buttonActionWrapper() {
    startButton.removeEventListener("click", buttonActionWrapper);
    snake.reset();
    startButtonAction();
}

function startButtonAction() {
    myvar = setInterval(() => {
        if (snake.playing) {
            snake.move();
        } else {
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


