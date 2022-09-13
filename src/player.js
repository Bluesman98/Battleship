import { throws } from "assert";

const { Gameboard } = require("./gameboard");

class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.nextMovesX = [];
    this.nextMovesY = [];
    this.nextMoveAxis = "x";
    this.lastHit = [];
    this.hitArray = [];
    this.ship_queue = [];
  }

  takeTurn(player) {
    let target;
    if (!this.nextMovesX.length && !this.nextMovesY.length) {
      this.nextShip(this.ship_queue, player);
    }
    if (!this.nextMovesX.length) {
      this.nextMoveAxis = "y";
    } else if (!this.nextMovesY.length) {
      this.nextMoveAxis = "x";
    }

    if (this.nextMovesY.length || this.nextMovesX.length) {
      if (this.nextMoveAxis === "x") {
        target = this.nextMovesX[this.nextMovesX.length - 1];
        this.nextMovesX.pop();
      } else if (this.nextMoveAxis === "y") {
        target = this.nextMovesY[this.nextMovesY.length - 1];
        this.nextMovesY.pop();
      }
    } else {
      target = this.randomMove();
      while (!player.gameboard.moveIsValid(target)) {
        target = this.randomMove();
      }
    }

    let result = player.gameboard.receiveAttack(target);
    if (result[1]) {
      player.gameboard.ships_sunk++;
      this.hitArray.push(target);
      this.multipleShips(this.nextMoveAxis, this.hitArray, result[2]);
      this.hitArray = [];
      this.nextMovesX = [];
      this.nextMovesY = [];
      this.lastHit = [];
    } else if (result[0] === "hit") {
      if (!this.hitArray.length) {
        this.generateMoves(target, player, this.nextMovesY, this.nextMovesX);
      } else if (this.nextMoveAxis === "x")
        this.generateMoves(target, player, 0, this.nextMovesX);
      else if (this.nextMoveAxis === "y")
        this.generateMoves(target, player, this.nextMovesY, 0);
      this.lastHit = (this.ship_queue, this.nextMoveAxistarget);
      this.hitArray.push(target);
    }
    return target;
  }

  randomMove() {
    let y = getRandomInt(0, 10);
    let x = getRandomInt(0, 10);
    if ([x, y]) return [x, y];
  }

  randomAddShip(ship_length, name) {
    while (true) {
      try {
        let target = this.randomMove();
        let axis = getRandomInt(0, 2);
        if (axis === 0) axis = "x";
        if (axis === 1) axis = "y";
        this.gameboard.addShip(target, axis, ship_length, name);
        let target_is_valid =
          target[0] >= 0 && target[0] <= 9 && target[1] >= 0 && target[1] <= 9;
        let axis_is_valid = axis === "x" || axis === "y";
        return target_is_valid && axis_is_valid;
      } catch (err) {}
    }
  }

  generateMoves(target, player, Y, X) {
    let y = target[0];
    let x = target[1];
    let moves = [
      [y + 1, x],
      [y - 1, x],
      [y, x + 1],
      [y, x - 1],
    ];
    for (let i in moves) {
      if (
        moves[i][0] >= 0 &&
        moves[i][0] <= 9 &&
        moves[i][1] >= 0 &&
        moves[i][1] <= 9 &&
        player.gameboard.moveIsValid(moves[i])
      ) {
        if (i <= 1 && Y !== 0) Y.push(moves[i]);
        else if (i > 1 && X !== 0) X.push(moves[i]);
      }
    }
  }

  multipleShips(axis, array, ship_length) {
    let array_sorted = [];
    if (!array.length) return -1;
    let a, b;
    if (axis === "y") {
      a = array[array.length - 1][1];
      b = 1;
    } else {
      a = array[array.length - 1][0];
      b = 0;
    }
    for (let i in array) {
      if (array[i][b] !== a) this.ship_queue.push(array[i]);
      else array_sorted.push(array[i]);
    }
    if (axis === "x") array_sorted = array_sorted.sort(this.sortFunctionX);
    else array_sorted = array_sorted.sort(this.sortFunctionY);

    if (array_sorted.length > ship_length) {
      this.ship_queue.push(array_sorted[0]);
      this.ship_queue.push(array_sorted[array_sorted.length - 1]);
    }
  }
  nextShip(queue, player) {
    if (!queue.length) return -1;
    this.generateMoves(queue[0], player, this.nextMovesY, this.nextMovesX);
    queue.shift();
  }

  sortFunctionY(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] < b[0] ? -1 : 1;
    }
  }

  sortFunctionX(a, b) {
    if (a[1] === b[1]) {
      return 0;
    } else {
      return a[1] < b[1] ? -1 : 1;
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export { Player };
