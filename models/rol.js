const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const rolSchema = new Schema({
  user:  String,
  role: {
    type: String,
    enum : ['Boss', 'Developer', 'TA']
  },
  password: String
});

const Rol = mongoose.model("Rol", rolSchema);
module.exports = Rol;