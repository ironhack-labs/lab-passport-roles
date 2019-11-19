const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaName = new Schema({

  title: String,
  description: String,

});

const Model = mongoose.model("courses", schemaName);
module.exports = Model;