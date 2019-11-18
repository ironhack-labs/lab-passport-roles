const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaName = new Schema({

  username: String,
  password: String,
  role: {
    type: String,
    enum: ['Boss', 'TA', 'Dev']
  }

});

const User = mongoose.model("user", schemaName);
module.exports = User;