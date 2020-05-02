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
        this.lastDirection = { dx: 0, dy: 0 };
        const parent = document.getElementsByClassName("game-board")[0];
        parent.innerText = "";
        const firstSquare = this._createSquare(0, 0, "blue");
        parent.appendChild(firstSquare);
        this.snake = [firstSquare];
        //display current score
        this._displayCurrentScore(parent);
        //display maximum score
        this._displayMaximumScore(parent);
        const size = firstSquare.offsetHeight;
        this.food = this._createFood(size);
        parent.appendChild(this.food);
    }

    /**
     * displays maximum score 
     */
    _displayMaximumScore(parent) {
        const maxScore = document.createElement("div");
        maxScore.id = "max-score";
        maxScore.innerText = `Maximum Score: ${localStorage.getItem("score") ? localStorage.getItem("score") : 0}`;
        const currentScore = document.getElementById("current-score");
        maxScore.style.left = currentScore.offsetWidth + "px";
        parent.appendChild(maxScore);
    }

    /**
     * displays current score
     */
    _displayCurrentScore(parent) {

        const currentScore = document.createElement("div");
        currentScore.id = "current-score";
        currentScore.innerText = `Score: ${this.score}`;
        parent.appendChild(currentScore);
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
        const num = ((boardSize - size) / size) - 1;
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
        this._changeDirection(dx, dy);
        const parent = document.getElementsByClassName("game-board")[0];
        const headIndex = this.snake.length - 1;
        const head = this.snake[headIndex];
        const tail = this.snake.shift();
        const width = head.offsetWidth;
        const height = head.offsetHeight;
        const y = head.offsetTop + height * this.lastDirection.dy;
        const x = head.offsetLeft + width * this.lastDirection.dx;
        this._makeMove(x, y, tail, parent, width, height);

    }


    /**
     * if snake's length is 1 or new (dx,dy) direction is not opposite 
     * of last saved direction change moving direction
     * @param {integer} dx new direction along x axis
     * @param {integer} dy new direction along y axis
     */
    _changeDirection(dx, dy) {
        const changeXDirextion = (this.lastDirection.dx === dx * (-1));
        const changeYDirextion = (this.lastDirection.dy === dy * (-1));

        if (!(changeXDirextion && changeYDirextion) || this.snake.length === 1) {
            this.lastDirection.dx = dx;
            this.lastDirection.dy = dy;
        }
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
            const scoreText = document.getElementById("current-score");
            scoreText.innerText = `Score: ${this.score}`
            return true;
        }
        return false;
    }






}