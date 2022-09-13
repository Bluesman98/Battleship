const path = require("path");

module.exports = {
  watch: true,

  entry: "./src/index.js",

  mode: "development",

  entry: {
    index: "./src/index.js",

    another: "./src/player.js",

    another: "./src/gameboard.js",

    another: "./src/ship.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
