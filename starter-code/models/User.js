const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaName = new Schema({

  username: String,
  password: String,
  role: {
    type: String,
    enum : ['Boss', 'TA', 'Dev']
  }

});

const Model = mongoose.model("users", schemaName);
module.exports = Model;