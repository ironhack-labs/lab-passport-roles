  const mongoose = require("mongoose");
const Schema = mongoose.Schema


const userSchema = new Schema({

  username: String,
  password:String,
  roles: {
    type: String,
    enum : [ 'Developer', 'TA'],
    default : 'Developer'
  },
  
});

const user = mongoose.model('employees', userSchema);
module.exports = user;