const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bossSchema = new Schema({
  username: String,
  password: String
}, {
    timestamps: true
  });

const Boss = mongoose.model("User", bossSchema);
module.exports = Boss;