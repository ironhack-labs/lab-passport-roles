const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const bookSchema = new Schema({
  name: String,
  surname: String,
  course: String
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

const Alumni = mongoose.model("Alumni", bookSchema);

module.exports = Alumni;