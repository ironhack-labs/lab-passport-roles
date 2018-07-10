const Schema = require('mongoose').Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema ({
  username: String,
//   password: String,
  email: String  ,
  role:{
    type: String,
    enum: ['BOSS', 'DEVELOPER', 'TA'],
    default: 'DEVELOPER'
  }
  
});
//agregar poderes que nos ayudaran a registrar con un hash
userSchema.plugin(passportLocalMongoose, {usernameField: 'email'})

module.exports = require('mongoose').model('User', userSchema)