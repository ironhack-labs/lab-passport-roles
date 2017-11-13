// require mongoose
const mongoose = require("mongoose");
//declare schema
const Schema = mongoose.Schema;

//link schema before exporting
userSchema = Schema();

//ITERATION 1
const UserSchema = Schema({
  username: String,
  name: String,
  familyName: String,
  password: String,
  role: {
    type: String,
    enum: ["Boss", "Developer", "TA"],
    default: "TA"
  }
});

//export
module.exports = userSchema;
