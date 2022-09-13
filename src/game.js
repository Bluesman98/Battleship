import _ from "lodash";
import { createArray } from "./gameboard";
import { Player } from "./player";

function createBoard(arr, parent) {
  let board = document.createElement("div");
  board.classList.add("board");

  for (let i = 0; i < arr.length; i++) {
    let row = document.createElement("div");
    row.classList.add("board-row");
    board.appendChild(row);
    for (let j = 0; j < arr[0].length; j++) {
      let item = document.createElement("div");
      item.classList.add("board-item");
      fillBoard(item, arr[i][j]);
      item.id = `${i}${j}`;
      row.appendChild(item);
    }
  }
  parent.appendChild(board);
  return board;
}

function fillBoard(item, value) {
  if (value == 0) return 0;
  if (value == 1) {
    item.classList.add("ship-tile");
    return 1;
  }
}

function shipToPlace(length, parent) {
  let ship = createBoard(createArray(length, 1, 1), parent);
  ship.classList.add("ship");
  ship.addEventListener("click", () => {
    document.querySelectorAll(".ship").forEach((item) => {
      item.classList.remove("selected");
    });
    ship.classList.add("selected");
  });
}
function hoverShip(board, player) {
  let axis = "x";
  let target;
  document.addEventListener("keydown", (key) => {
    if (key.code === "KeyR") {
      axis === "x" ? (axis = "y") : (axis = "x");
    }
    displayShip(target, axis, board);
  });

  board.addEventListener("mouseover", (e) => {
    target = e.target;
    displayShip(target, axis, board);
  });

  board.addEventListener("click", (e) => {
    placeSelectedShip(e.target, axis, player);
  });
}

function displayShip(target, axis, board) {
  board.querySelectorAll(".ship-hover").forEach((ship_tile) => {
    ship_tile.classList.remove("ship-hover");
  });
  let selected_ship = document.querySelector(".selected");
  if (selected_ship) {
    if (target.classList.contains("board-item")) {
      for (let i = 0; i < selected_ship.firstChild.children.length; i++) {
        let y;
        let x;
        if (axis === "x") {
          y = String(Number(target.id[0]) + 1);
          x = String(Number(target.id[1]) + 1 + i);
        } else if (axis === "y") {
          y = String(Number(target.id[0]) + 1 + i);
          x = String(Number(target.id[1]) + 1);
        }
        if (x >= 1 && x <= 10 && y >= 1 && y <= 10) {
          board
            .querySelector(
              `.board-row:nth-child(${y})>.board-item:nth-child(${x})`
            )
            .classList.add("ship-hover");
        }
      }
    }
  }
}

function placeSelectedShip(target, axis, player) {
  let selected_ship = document.querySelector(".selected");
  if (selected_ship && target.classList.contains("board-item")) {
    let y = Number(target.id[0]);
    let x = Number(target.id[1]);

    let ship_tiles = player.gameboard.placeShip(
      [y, x],
      axis,
      selected_ship.firstChild.children.length
    );
    for (let i = 0; i < ship_tiles.length; i++) {
      let a = String(Number(ship_tiles[i][0]));
      let b = String(Number(ship_tiles[i][1]));
      document.getElementById(a + b).classList.add("ship-tile");
    }

    player.gameboard.addShip(
      [y, x],
      axis,
      selected_ship.firstChild.children.length
    );
    selected_ship.remove();
  }
}

function createPlayerGrid(player, parent) {
  const board = createBoard(createArray(10, 10, 0), parent);
  let container = document.createElement("div");
  container.classList.add("ship-container");
  parent.appendChild(container);
  shipToPlace(5, container);
  shipToPlace(4, container);
  shipToPlace(3, container);
  shipToPlace(3, container);
  shipToPlace(2, container);
  hoverShip(board, player);
}

function startButton(parent, player, ai) {
  let btn = document.createElement("button");
  let error = document.querySelector(".error");
  btn.textContent = "Start Game";
  btn.onclick = () => {
    let container = document.querySelector(".ship-container");
    if (container.childElementCount === 0) {
      document.querySelector(".placement-screen").remove();
      game(player, ai);
    } else error.textContent = "Please Place All Ships";
  };
  parent.appendChild(btn);
}

function placementScreen() {
  let main = document.querySelector(".main");
  let container = document.createElement("div");
  container.classList.add("placement-screen");
  main.appendChild(container);
  let msg = document.createElement("div");
  msg.textContent = "Press R to rotate ship";
  container.appendChild(msg);
  let error = document.createElement("div");
  error.classList.add("error");
  container.appendChild(error);
  let ai = new Player();
  ai.randomAddShip(5, "Carrier");
  ai.randomAddShip(4, "Battleship");
  ai.randomAddShip(3, "Cruiser");
  ai.randomAddShip(3, "Submarine");
  ai.randomAddShip(2, "Destroyer");

  let player = new Player();
  let top = document.createElement("div");
  top.classList.add("top");
  container.appendChild(top);
  createPlayerGrid(player, top);

  let bottom = document.createElement("div");
  container.appendChild(bottom);
  bottom.classList.add("bottom");
  startButton(bottom, player, ai);
}

function game(player, ai) {
  const main = document.querySelector(".main");
  let container = document.createElement("div");
  container.classList.add("game");
  main.appendChild(container);

  let msg = document.createElement("span");
  msg.classList.add("msg");
  container.appendChild(msg);

  let board_container = document.createElement("div");
  board_container.classList.add("board-container");
  container.appendChild(board_container);

  let target_grid = createBoard(createArray(10, 10, 0), board_container);
  let player_grid = createBoard(player.gameboard.board, board_container);
  target_grid.addEventListener("click", a);

  function a(e) {
    //Player turn
    let y = e.target.id[0];
    let x = e.target.id[1];
    if (ai.gameboard.moveIsValid([y, x])) {
      let result = ai.gameboard.receiveAttack([y, x]);
      createDot(e.target, result);
      if (result[0] === "hit") {
        if (result[1]) {
          msg.textContent = result[1];
          ai.gameboard.ships_sunk++;
        } else msg.textContent = "Your shot is a hit";
      }
      if (result[0] === "miss") msg.textContent = "Your shot is a miss";
      if (ai.gameboard.gameOver()) {
        msg.textContent = "Player wins";
        target_grid.removeEventListener("click", a);
        gameOverFunc();
        return 0;
      }

      //Ai turn
      let target = ai.takeTurn(player);
      console.log(player.gameboard.ships_sunk);
      let ai_result = player.gameboard.receiveAttack(target);
      let z = String(Number(target[0]) + 1);
      let v = String(Number(target[1]) + 1);
      let player_grid_target = player_grid.querySelector(
        `.board-row:nth-child(${z})>.board-item:nth-child(${v})`
      );
      createDot(player_grid_target, ai_result);
      if (player.gameboard.gameOver()) {
        msg.textContent = "AI wins";
        target_grid.removeEventListener("click", a);
        gameOverFunc();
        return 0;
      }
    } else console.log("Invalid Move");
  }
}

function createDot(parent, result) {
  let dot = document.createElement("span");
  dot.classList.add("dot");
  if (result[0] == "hit") {
    dot.classList.add("hit");
    parent.classList.add("ship-tile");
  }
  parent.appendChild(dot);
}

function gameOverFunc() {
  let btn = document.createElement("button");
  btn.textContent = "New Game";
  btn.onclick = () => {
    document.querySelector(".main").innerHTML = "";
    placementScreen();
  };

  document.querySelector(".msg").appendChild(btn);
}

export { game, createBoard, placementScreen, gameOverFunc };
