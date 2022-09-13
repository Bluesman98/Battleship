import { Ship } from "./ship";

class Gameboard {
  constructor() {
    this.board = createArray(10, 10, 0);
    this.fleet = [];
    this.received = [];
    this.ships_sunk = 0;
  }

  addShip(target, axis, length, name) {
    let fleet_ship = new fleetElement(length, name);
    let pos = this.placeShip(target, axis, length);
    fleet_ship.pos = pos;
    this.fleet.push(fleet_ship);
    this.markBoard(pos);
  }

  placeShip(target, axis = "x", ship_length) {
    if (ship_length == 0) return [];
    if (!(axis === "x" || axis === "y")) throw "invalid axis";
    let ship_cells = [];
    let y = target[0];
    let x = target[1];
    for (let i = 0; i < ship_length; i++) {
      let cell = [];

      if (axis === "x") cell = [y, x + i];
      else if (axis === "y") cell = [y + i, x];

      if (this.board[cell[0]][cell[1]] == 1) {
        throw "ship overlaps with another ship";
      }

      if (cell[0] < 0 || cell[0] > 9 || cell[1] < 0 || cell[1] > 9)
        throw "ship out of bounds";
      ship_cells.push(cell);
    }
    return ship_cells;
  }

  markBoard(array) {
    for (let i = 0; i < array.length; i++) {
      this.board[array[i][0]][array[i][1]] = 1;
    }
  }

  receiveAttack(target) {
    this.received.push(target);

    if (this.board[target[0]][target[1]] === 1) {
      let msg = this.registerHit(target);
      if (msg.length) {
        let x = ["hit"];
        x.push(msg[0]);
        x.push(msg[1]);
        return x;
      }
      return ["hit", msg];
    } else if (this.board[target[0]][target[1]] === 0) {
      return ["miss"];
    }
  }

  registerHit(target) {
    let fleet = this.fleet;
    for (let i in fleet) {
      for (let j in fleet[i].pos) {
        if (
          fleet[i].pos[j][0] == target[0] &&
          fleet[i].pos[j][1] == target[1]
        ) {
          fleet[i].ship.hit(j);
          if (fleet[i].ship.isSunk()) {
            return [`You sunk the ${fleet[i].ship.name}`, fleet[i].ship.length];
          }
          return 0;
        }
      }
    }
  }
  moveIsValid(target, array = this.received) {
    let arr = array;
    for (let i = 0; i < arr.length; i++) {
      if (target[0] == arr[i][0] && target[1] == arr[i][1]) return false;
    }
    return true;
  }
  gameOver() {
    if (this.ships_sunk >= this.fleet.length) return true;
    return false;
  }
}

class fleetElement {
  constructor(length, name) {
    this.ship = new Ship(length, name);
    this.pos = [];
  }
}

function createArray(cols, rows, val) {
  let arr = new Array(rows);
  for (let j = 0; j < rows; j++) {
    arr[j] = new Array(cols).fill(val);
  }
  return arr;
}

export { Gameboard, createArray };
