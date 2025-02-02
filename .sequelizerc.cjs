const path = require("path");

module.exports = {
  config: path.resolve(__dirname, "backend", "config", "config.js"),
  "models-path": path.resolve(__dirname, "backend", "models"),
  "migrations-path": path.resolve(__dirname, "backend", "migrations"),
  "seeders-path": path.resolve(__dirname, "backend", "seeders"),
};
