const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaName = new Schema(
  {
    name: String,
    password: String,
    role: { type: String, enum: ["Boss", "Developer", "TA"] }
  },
  {
    timestamps: true
  }
);

const Model = mongoose.model("User", schemaName);
module.exports = Model;