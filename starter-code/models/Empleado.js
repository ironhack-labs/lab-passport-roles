const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const empleadoSchema = new Schema(
  {
    name: String,
    lastname: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Empleado", empleadoSchema);