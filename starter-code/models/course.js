const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchameName = new Schema({
  name: String
});

const Model = mongoose.model("Course", SchameName);
module.exports = Model;
