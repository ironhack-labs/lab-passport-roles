const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username : String,
  name : String,
  familyName: String,
  password: String,
  role : {
    type: String,
    enum : ['BOSS', 'DEVELOPER', 'TA'],
    default: 'TA'
  }

});

module.exports = mongoose.model("User", userSchema);
