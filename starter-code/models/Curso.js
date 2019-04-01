const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cursoSchema = new Schema(
  {
    name: String,
    cost: Number,
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Curso", cursoSchema);