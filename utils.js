"use strict";

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const md5 = require("md5");

const { SYNC_DIRECTORY } = process.env;

const File = require("./models/file");

async function getFileDetails() {
  return new Promise((resolve, reject) => {
    let result = [];
    fs.readdir(path.join(__dirname, SYNC_DIRECTORY), async (err, files) => {
      if (err) reject(err);
      try {
        for (const file of files) {
          const data = await readFile(
            path.join(__dirname, SYNC_DIRECTORY, file)
          );
          const id = await getHash(path.join(SYNC_DIRECTORY, file));
          const fileModel = await File.where({ id }).fetch();
          const fileInfo = {
            event: fileModel.get("event"),
            hash: fileModel.get("hash"),
            id: fileModel.get("id"),
            path: fileModel.get("path"),
            updatedAt: fileModel.get("updated_at")
          };
          result.push({
            fileInfo,
            data
          });
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function readFile(localPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(localPath, (err, data) => {
      if (err) reject({ err });
      resolve(data.toString());
    });
  });
}

async function writeToFile(filePath, data) {
  return new Promise((resolve, reject) => {
    return fs.writeFile(filePath, data, err => {
      if (err) reject(err);
      resolve(`Data written to ${filePath}`);
    });
  });
}

async function getFileHash(localPath) {
  const file = fs.readFileSync(localPath);
  return md5(file);
}

async function getHash(text) {
  return md5(text);
}

async function updateDatabase(event, filePath) {
  try {
    const id = await getHash(filePath);
    const alreadyPresent = await File.where({ id }).fetch();

    const localPath = path.join(__dirname, filePath);
    const newFileHash = await getFileHash(localPath);

    if (alreadyPresent) {
      console.log(`Already present in db.`);
      /**
       * update db here.
       * calculate hash again.
       *
       */
      const saved = await alreadyPresent
        .where({
          id
        })
        .save(
          {
            event,
            hash: newFileHash,
            updated_at: Math.round(new Date().getTime() / 1000)
          },
          { method: "update" }
        );
    } else {
      console.log(`Not present in db. Adding`);
      await File.forge({
        id,
        event,
        path: filePath,
        hash: newFileHash,
        updated_at: Math.round(new Date().getTime() / 1000)
      }).save(null, { method: "insert" });
    }
  } catch (error) {
    return {
      error
    };
  }
}

module.exports = {
  getFileDetails,
  updateDatabase,
  writeToFile
};
