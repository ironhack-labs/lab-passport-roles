const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username:String,
  email:String,
  role:{
    type:String,
    enum: ['BOSS', 'DEVELOPER', 'TA'],
    default: 'DEVELOPER'
    }
  },{
    timestamps:{
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'})

module.exports = mongoose.model('User', userSchema);


