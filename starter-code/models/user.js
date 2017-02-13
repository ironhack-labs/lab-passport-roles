const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username: String,
    name: String,
    familyName: String,
    password: String,
    role: {
    type: String,
    enum : ['TA', 'Developer', 'Boss'],
    default : 'TA'
  }

});


const User = mongoose.model("User", UserSchema);

module.exports = User;
