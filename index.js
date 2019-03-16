"use strict";

const Rsync = require("rsync");
const path = require("path");

// Build the command
const rsync = new Rsync()
  .shell("ssh")
  .flags("az")
  .source(
    `ubuntu@ec2-13-127-188-152.ap-south-1.compute.amazonaws.com:${path.join(
      __dirname,
      "data/"
    )}`
  )
  .destination(`${path.join(__dirname, "data/")}`);

rsync.execute(function(error, code, cmd) {
  if (error) throw error;
  console.log(`Code: ${code}`);
  console.log(`Cmd: ${cmd}`);
  console.log(`<> Synced <>`);
});
