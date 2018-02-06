const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String
    //   required: true,
    //   unique: true
  },
  name: {
    type: String
  },
  familyName: {
    type: String
  },
  password: {
    // type: String,
    // required: true
  },
  role: {
    type: String
  }
});

module.exports = mongoose.model("User", userSchema);
