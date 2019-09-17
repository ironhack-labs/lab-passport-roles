const mongoose = require('mongoose');
const Schema= mongoose.Schema

const userSchema = new Schema({

  username:{
    type:String,
    unique:true,

  },
  password:{
    type:String,

  },
  role:{
    type:String,
    enum: ['BOSS', 'DEV','TA'],
  }
   
})

const User = mongoose.model('User', userSchema);
module.exports=User