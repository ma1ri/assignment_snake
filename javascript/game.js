export class Game {
    constructor() {
        this.reset();
        this.restart();
    }

    reset() {
        this.play = true;
    }

    restart() {
        this.score = 0;
        const parent = document.getElementsByClassName("game-board")[0];
        parent.innerText = "";
        const firstSquare = this._createSquare(0, 0, "blue");
        parent.appendChild(firstSquare);
        this.snake = [firstSquare];
        //display maximum score
        this._displayMaximumScore();
        //display current score
        this._displayCurrentScore();
        const size = firstSquare.offsetHeight;
        this.food = this._createFood(size);
        parent.appendChild(this.food);
    }

    /**
     * displays maximum score 
     */
    _displayMaximumScore() {
        const maxScore = document.getElementById("max-score");
        maxScore.innerText = `Maximum Score: ${localStorage.getItem("score") ? localStorage.getItem("score") : 0}`
    }

    /**
     * displays current score
     */
    _displayCurrentScore() {
        const currentScore = document.getElementById("score");
        currentScore.innerText = `Score: ${this.score}`;
    }

    _createFood(size) {
        const coordinates = this._generateCoordinates(size);
        // console.log(coordinates);
        const food = this._createSquare(coordinates[0], coordinates[1], "red");
        return food;
    }


    _generateCoordinates(size) {
        const board = document.getElementsByClassName("game-board")[0];
        const boardSize = board.offsetHeight;
        const num = (boardSize - size) / size;
        const xCoord = Math.floor((Math.random() * num)) * size;
        const yCoord = Math.floor((Math.random() * num)) * size;
        return [xCoord, yCoord];
    }
    _createSquare(xCoord, yCoord, color) {
        let square = document.createElement('div');
        square.classList.add('square');
        square.style.backgroundColor = color;
        square.style.left = `${xCoord}px`;
        square.style.top = `${yCoord}px`;
        return square;
    }

    move(dx, dy) {
        const parent = document.getElementsByClassName("game-board")[0];
        const headIndex = this.snake.length - 1;
        const head = this.snake[headIndex];
        const tail = this.snake.shift();
        let width = head.offsetWidth;
        let height = head.offsetHeight;
        let y = head.offsetTop + height * dy;
        let x = head.offsetLeft + width * dx;
        this._makeMove(x, y, tail, parent, width, height);
    }


    _makeMove(x, y, tail, parent, width, height) {
        if (this._collideWall(x, y, width, height, parent) === true || this._collideBody(x, y)) {
            this.play = false;
            this._updateLocalStorage();
            this.restart();
        } else {
            if (this._collideFood(x, y) === true) {
                this._eatFood();
                //add new food
                this.food = this._createFood(width);
                parent.appendChild(this.food);
            }
            this._moveTail(tail, parent, x, y);
        }
    }

    _moveTail(tail, parent, x, y) {
        parent.removeChild(tail);
        const newSeg = this._createSquare(x, y, "blue");
        parent.appendChild(newSeg);
        this.snake.push(newSeg);
    }

    _eatFood() {
        this.food.style.backgroundColor = "blue";
        this.snake.unshift(this.food);
    }


    _collideBody(x, y) {
        for (const square of this.snake) {
            if (x === square.offsetLeft && y === square.offsetTop) {
                return true;
            }
        }
        return false;
    }


    _collideWall(x, y, width, height, parent) {
        const rightWall = parent.offsetWidth;
        const bottomWall = parent.offsetHeight;
        if (x < 0 || y < 0 || x + width > rightWall || y + height > bottomWall) {
            return true;
        }
        return false;
    }


    _updateLocalStorage() {
        let score = localStorage.getItem("score");
        if (score == null) {
            localStorage.setItem("score", this.score);
        } else {
            let score = JSON.parse(localStorage.getItem("score"));
            if (parseInt(score) < this.score) {
                localStorage.removeItem("score");
                localStorage.setItem("score", this.score);
            }
        }
    }


    _collideFood(x, y) {
        const foodXCoord = this.food.offsetLeft;
        const foodYCoord = this.food.offsetTop;
        if (foodXCoord === x && foodYCoord === y) {
            this.score += 10;
            const scoreText = document.getElementById("score");
            scoreText.innerText = `Score: ${this.score}`
            return true;
        }
        return false;
    }






}