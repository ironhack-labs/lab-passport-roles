const {Schema, model} = require('mongoose');
const PLM = require('passport-local-mongoose');

const userSchema = new Schema({
  username: String,
  role:{
    type: String,
    enum : ['BOSS','DEVELOPER','TA'],
    default : 'TA'
  }
},
{
  timestamps : true,
  versionKey : false
})

userSchema.plugin(PLM, { usernameField: 'username'})

module.exports = model('User', userSchema );