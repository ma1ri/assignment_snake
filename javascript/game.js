export class Game {
    constructor() {
        this.play = true;
        this.restart();
    }
    /**
     * sets gameplay to true
     * @param {boolean} value
     */
    set setPlay(value) {
        this.play = value;
    }

    /** 
     * getter that returns boolean if game still continues
     */
    get playing() {
        return this.play;
    }

    /**
     * resets game state and board
     */
    restart() {
        this.score = 0;
        this.lastDirection = { dx: 1, dy: 0 };
        this.direction = { dx: 1, dy: 0 };
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
     * takes keaboard event and generates new direction vector
     * return value is object where dx is direction along x axis
     * and dy is direction along y axis
     * 1 means moving  along axis
     * 0 mean no move
     * -1 means moving oposite direction 
     * @param {*} event keaboard event 
     */
    getDirection(event) {
        switch (event.keyCode) {
            case 37:
                this.direction = { dx: -1, dy: 0 };
                break;
            case 38:
                this.direction = { dx: 0, dy: -1 };
                break;
            case 39:
                this.direction = { dx: 1, dy: 0 };
                break;
            case 40:
                this.direction = { dx: 0, dy: 1 };
                break;
        }
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

    /**
     * creates new food square
     * @param {integer} size width and heigth
     */
    _createFood(size) {
        const coordinates = this._generateCoordinates(size);
        // console.log(coordinates);
        const food = this._createSquare(coordinates[0], coordinates[1], "red");
        return food;
    }

    /**
     * generates random coordinates for food square
     * returned coordinates are used to set offsets 
     * @param {integer} size 
     */
    _generateCoordinates(size) {
        const board = document.getElementsByClassName("game-board")[0];
        const boardSize = board.clientHeight;
        const num = ((boardSize - size) / size) - 1;
        const xCoord = Math.floor((Math.random() * num)) * size;
        const yCoord = Math.floor((Math.random() * num)) * size;
        return [xCoord, yCoord];
    }


    /**
     * cretes new square part of snake
     * sets new offsets at (xCoord,yCoord) and sets color 
     * to given color
     * @param {integer} xCoord 
     * @param {integer} yCoord 
     * @param {*} color 
     */
    _createSquare(xCoord, yCoord, color) {
        let square = document.createElement('div');
        square.classList.add('square');
        square.style.backgroundColor = color;
        square.style.left = `${xCoord}px`;
        square.style.top = `${yCoord}px`;
        return square;
    }

    /**
     * moves snake's tail square to the front by calculating 
     * new offsetTop and offsetLeft 
     */
    move() {
        this._changeDirection();
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
     * of last saved direction, change moving direction
     */
    _changeDirection() {
        const changeXDirextion = (this.lastDirection.dx === this.direction.dx * (-1));
        const changeYDirextion = (this.lastDirection.dy === this.direction.dy * (-1));

        if (!(changeXDirextion && changeYDirextion) || this.snake.length === 1) {
            this.lastDirection = this.direction;
        }
    }
    /**
     * checks for collisions and moves snake's last square to 
     * the front
     * if there is a collision with wall resets game state
     * if there is a collision with food eats the food
     * @param {integer} x coordinate along x axis
     * @param {integer} y coordinate along y axis
     * @param {*} tail node
     * @param {*} parent node
     * @param {integer} width snake's unit square width
     * @param {integer} height snake's unit square heigth
     */
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
    /**
     * removes tail of snake, creates new node at (x,y) coordinate 
     * and appends this new node to parent node
     * @param {*} tail node 
     * @param {*} parent node
     * @param {integer} x new coordinate along x axis
     * @param {integer} y new coordinate along y axis
     */

    _moveTail(tail, parent, x, y) {
        parent.removeChild(tail);
        const newSeg = this._createSquare(x, y, "blue");
        parent.appendChild(newSeg);
        this.snake.push(newSeg);
    }
    /**
     * takes food square, changes its color and adds it in snake's array
     */
    _eatFood() {
        this.food.style.backgroundColor = "blue";
        this.snake.unshift(this.food);
    }

    /**
     * checks if there is a collision with snake's squares
     * @param {integer} x new coordinate alog x axis
     * @param {integer} y new coordinate along y axis
     */
    _collideBody(x, y) {
        for (const square of this.snake) {
            if (x === square.offsetLeft && y === square.offsetTop) {
                return true;
            }
        }
        return false;
    }

    /**
     * checks if there is a collision with
     * parent node's walls
     * @param {integer} x new coordinate along x axis
     * @param {integer} y new coordinate along y axis
     * @param {integer} width width of snake square
     * @param {integer} height heigth of snake quare
     * @param {*} parent parent node 
     */


    _collideWall(x, y, width, height, parent) {
        const rightWall = parent.clientWidth;
        const bottomWall = parent.clientHeight;
        if (x < 0 || y < 0 || x + width > rightWall || y + height > bottomWall) {
            return true;
        }
        return false;
    }

    /**
     * if current score is greater than current maximum score
     * saves new maximum score to local storage
     */
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

    /**
     * checks if new (x,y) coordinates collide with food square
     * if there is a collision increases current score and returs true
     * @param {integer} x  new coordinate along x axis
     * @param {integer} y  new coordinate along y axis
     */
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