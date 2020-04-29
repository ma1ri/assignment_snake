export class Game {
    constructor() {
        this._restart();
    }




    _restart() {
        this.score = 0;
        this.snake = [];
        const parent = document.getElementsByClassName("game-board")[0];
        let firstSquare = this._createSquare(0, 0, "blue");
        parent.appendChild(firstSquare);
        this.snake = [firstSquare];

        const size = firstSquare.offsetHeight;
        this.food = this._createFood(size);
        parent.appendChild(this.food);
    }


    _createFood(size) {
        const coordinates = this._generateCoordinates(size);
        // console.log(coordinates);
        const food = this._createSquare(coordinates[0], coordinates[1], "red");
        return food;
    }


    _generateCoordinates(size) {
        const board = document.getElementsByClassName("game-board")[0];
        const boardSize = board.offsetHeight - 4;
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
        const res = this._makeMove(x, y, tail, parent, width, height, dx, dy);
        // console.log(x, y);



    }


    _moveThoughtWall(dx, dy, x, y, tail, parentSize, parent) {
        let width = tail.offsetWidth;
        let height = tail.offsetHeight;
        const xCoord = (dx === 1 ? 0 : (dx === -1 ? (parentSize - width - 4) : x));
        const yCoord = (dy === 1 ? 0 : (dy === -1 ? (parentSize - height - 4) : y));
        const newSeg = this._createSquare(xCoord, yCoord, "blue");
        parent.appendChild(newSeg);
        parent.removeChild(tail);
        this.snake.push(newSeg);

    }

    _makeMove(x, y, square, parent, width, height, dx, dy) {
        if (this._collideWall(x, y, width, height, parent) === true) {
            this._moveThoughtWall(dx, dy, x, y, square, parent.offsetHeight, parent);
            return false;
        } else if (this._collideFood(x, y) === true) {
            this.food.style.backgroundColor = "blue";
            this.snake.unshift(this.food);
            this.food = this._createFood(width);
            parent.appendChild(this.food);

        }
        parent.removeChild(square);
        const newSeg = this._createSquare(x, y, "blue");
        parent.appendChild(newSeg);
        this.snake.push(newSeg);
        return true;

    }


    _collideWall(x, y, width, height, parent) {
        const rightWall = parent.offsetWidth;
        const bottomWall = parent.offsetHeight;
        if (x < 0 || y < 0 || x + width > rightWall || y + height > bottomWall) {
            return true;
        }

        return false;

    }

    _collideFood(x, y) {
        this.score += 10;
        const foodXCoord = this.food.offsetLeft;
        const foodYCoord = this.food.offsetTop;
        if (foodXCoord === x && foodYCoord === y) {
            return true;
        }
        return false;
    }






}