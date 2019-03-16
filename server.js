"use strict";

require("dotenv").config();

const path = require("path");
const express = require("express");
const chokidar = require("chokidar");

const mainRouter = require("./router");

const { updateDatabase } = require("./utils");

const { APP_PORT, SYNC_DIRECTORY } = process.env;

class Server {
  constructor() {
    this.app = express();
    this.routes();
  }

  routes() {
    this.app.use(mainRouter);
    this.setupChokidar();
  }

  setupChokidar() {
    console.log(`Chokidar running`);
    const watcher = chokidar.watch(`./${SYNC_DIRECTORY}/**`, {
      ignored: /[\/\\]\./,
      persistent: true
    });
    watcher.on("all", (event, filePath) => {
      updateDatabase(event, filePath);
    });
  }
}

module.exports = new Server().app;
