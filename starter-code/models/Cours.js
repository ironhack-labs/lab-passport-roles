const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const coursSchema = new Schema({
  name: {type: String, unique: true, required: true},
  description: {type: String, required: true},
}, {
  timestamps: true
});

const Cours = mongoose.model("Cours", coursSchema);

module.exports = Cours;