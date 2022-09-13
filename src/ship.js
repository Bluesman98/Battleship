class Ship {
  constructor(length, name) {
    this.length = length;
    this.status = new Array(length).fill(0);
    this.name = name;
  }

  hit(x) {
    if (x < this.length && x >= 0) {
      this.status[x] = 1;
    } else throw "x is out of ship bounds";
  }

  isSunk() {
    for (let i in this.status) {
      if (this.status[i] === 0) return false;
    }
    return true;
  }
}

export { Ship };
