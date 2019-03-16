"use strict";

const express = require("express");
const router = express.Router();

const { getFileDetails } = require("./utils");

router.get("/", (req, res) => {
  res.status(200).send("okay.");
});

router.get("/file", async (req, res) => {
  try {
    const result = await getFileDetails();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
