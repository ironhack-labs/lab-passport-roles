const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaRoles = new Schema({
    name: String,
    role: {
    type: String,
    enum : ['BOSS', 'DEVELOPER', 'TA'],
    default: 'TA'
  }
} ,{
    timestamps: true
  });

const User = mongoose.model("User", schemaRoles);
module.exports = User;
