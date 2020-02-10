const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchameName = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["Boss", "Developer", "TA", "Student"]
  }
});

const Model = mongoose.model("User", SchameName);
module.exports = Model;
