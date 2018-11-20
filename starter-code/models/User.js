const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  isAdmin: Boolean,
  role: [{
    type: String,
    enum : ['BOSS', 'TA', 'DEVELOPER'],
    default:'DEVELOPER'
  }]
})