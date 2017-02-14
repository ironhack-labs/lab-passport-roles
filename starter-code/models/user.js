const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username   : String,
  name       : String,
  familyName : String,
  password   : String,
  role     : {
    type    : String,
    enum    : ['TA', 'Developer', 'Boss']
  },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
