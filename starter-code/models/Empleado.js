const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const empleadoSchema = new Schema(
  {
    name: String,
    lastname: String,
    role: {
      type: String,
      enum : ['BOSS', 'DEV', 'TA'],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Empleado", empleadoSchema);