import { Ship } from "./ship.js";

test("ship hit", () => {
  let destroyer = new Ship(3);
  destroyer.hit(1);
  expect(destroyer.status[1]).toBe(1);
});

test("ship hit error", () => {
  let destroyer = new Ship(3);

  expect(() => {
    destroyer.hit(3);
  }).toThrow();
});

test("ship status", () => {
  let destroyer = new Ship(3);
  destroyer.hit(1);
  expect(destroyer.status).toEqual([0, 1, 0]);
});

test("ship is sunk", () => {
  let destroyer = new Ship(3);
  destroyer.hit(0);
  destroyer.hit(1);
  destroyer.hit(2);
  expect(destroyer.isSunk()).toBe(true);
});
