const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const userSchema =  new Schema({
    name: String,
    password: String,
    role: {
          type: String,
          enum : ['BOSS', 'DEVELOPPER', 'TA'],
          default : 'DEVELOPPER'
        },
});



const User = mongoose.model("User", userSchema);
module.exports = User;
