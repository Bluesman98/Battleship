import { Gameboard } from "./gameboard";

describe("add ship", () => {
  let board = new Gameboard();
  board.addShip([0, 0], "x", 3);

  test("ship is in fleet", () => {
    expect(board.fleet[0].ship.length).toBe(3);
  });

  test("ship position", () => {
    expect(board.fleet[0].pos).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  test("mark ship position on board", () => {
    expect(board.board[0][0]).toBe(1);
    expect(board.board[0][1]).toBe(1);
    expect(board.board[0][2]).toBe(1);
  });
});

describe("recieve attack", () => {
  let board = new Gameboard();
  board.addShip([0, 0], "x", 3);

  test("miss", () => {
    expect(board.receiveAttack([0, 3])).toEqual("miss");
  });
  test("hit", () => {
    expect(board.receiveAttack([0, 2])).toEqual("hit");
  });

  test("hit registers on ship", () => {
    board.receiveAttack([0, 2]);
    expect(board.fleet[0].ship.status).toEqual([0, 0, 1]);
  });
});

describe("all ships are sunk", () => {
  let board = new Gameboard();

  //sink first ship
  board.addShip([0, 0], "x", 3);
  board.receiveAttack([0, 0]);
  board.receiveAttack([0, 1]);
  board.receiveAttack([0, 2]);

  //missed attack
  board.receiveAttack([1, 2]);

  //sink second ship
  board.addShip([1, 0], "y", 2);
  board.receiveAttack([1, 0]);
  board.receiveAttack([2, 0]);

  test("ships_sunk equals number of ships", () => {
    expect(board.ships_sunk).toBe(2);
  });

  test("received attacks kept in track", () => {
    expect(board.received).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
      [1, 0],
      [2, 0],
    ]);
  });

  test("Gameover is true", () => {
    expect(board.gameOver()).toBe(true);
  });
});
describe("move validation", () => {
  let board = new Gameboard();
  board.receiveAttack([0, 2]);
  board.receiveAttack([1, 0]);
  board.receiveAttack([3, 4]);

  test("move is valid", () => {
    expect(board.moveIsValid([0, 1])).toBe(true);
  });

  test("move is invalid", () => {
    expect(board.moveIsValid([1, 0])).toBe(false);
  });
});
