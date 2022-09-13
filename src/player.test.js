import { Player } from "./player";

test("random Place ship is valid", () => {
  let ai = new Player();
  for (let i = 0; i < 10; i++) {
    expect(ai.randomAddShip(3)).toBeTruthy();
  }
});

test("place all the ships", () => {
  for (let i = 0; i < 10; i++) {
    let ai = new Player();
    ai.randomAddShip(5);
    ai.randomAddShip(4);
    ai.randomAddShip(3);
    ai.randomAddShip(3);
    ai.randomAddShip(2);
    expect(ai.gameboard.board.length).toBe(10);
    expect(ai.gameboard.board[0].length).toBe(10);
  }
});
