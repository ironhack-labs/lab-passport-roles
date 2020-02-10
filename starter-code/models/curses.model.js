const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cursesSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: "Web Development"
  }
}, {
  timestamps: {
    timestamps: true
  }
});

const Curses = mongoose.model("Curses", cursesSchema);

module.exports = Curses