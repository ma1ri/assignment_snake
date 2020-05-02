import { Game } from './game.js';


const snake = new Game();
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");
document.addEventListener("keydown", (event) => { snake.getDirection(event) });

//saves setinterval timer
let myvar;


/**
 * event listener function for start button
 */
function startGame() {
    startButton.removeEventListener("click", startGame);
    snake.setPlay = true;
    play();
}
/**
 * timer for playing 
 */
function play() {
    myvar = setInterval(() => {
        if (snake.playing) {
            snake.move();
        } else {
            clearInterval(myvar);
            startButton.addEventListener("click", startGame, false);
        }
    }, 100);
}



// add event listeners to buttons

startButton.addEventListener("click", startGame, false);

pauseButton.addEventListener("click", () => {
    clearInterval(myvar);
    startButton.addEventListener("click", startGame, false);
});

stopButton.addEventListener("click", () => {
    clearInterval(myvar);
    snake.restart();
    startButton.addEventListener("click", startGame, false);
});


