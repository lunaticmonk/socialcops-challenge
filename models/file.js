"use strict";

const db = require("../database");

const File = db.Model.extend({
  tableName: "files"
});

module.exports = File;
