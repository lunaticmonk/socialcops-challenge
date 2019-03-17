"use strict";

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { BASE_ADDRESS } = process.env;

const File = require("./models/file");

const { writeToFile } = require("./utils");

async function sync() {
  const { data: files } = await axios.get(`http://${BASE_ADDRESS}:4000/file`);
  for (const file of files) {
    const { fileInfo: info, data: contentOfFile } = file;
    const { id, hash, updatedAt: timestamp, path: localPath, event } = info;

    const fileOnCurrentMachine = await File.where({ id }).fetch();

    if (fileOnCurrentMachine) {
      if (hash === fileOnCurrentMachine.get("hash")) {
        console.log(`same hash. no change: ${localPath}`);
      } else {
        console.log(`file is different: ${localPath}`);

        if (fileOnCurrentMachine.get("updated_at") < timestamp) {
          /**
           * write the remote contents to local file here.
           * update the event in db. no need for updateDatabase since it will explicitly called by file watcher.
           *
           */

          const pathToWrite = path.join(__dirname, localPath);
          await writeToFile(pathToWrite, contentOfFile);
        }
      }
    } else {
      /**
       * Add the file, to the db too. here too no need for updateDatabase.
       *
       */
      const pathToWrite = path.join(__dirname, localPath);
      await writeToFile(pathToWrite, contentOfFile);
    }
  }
  process.exit(1);
}

sync();
