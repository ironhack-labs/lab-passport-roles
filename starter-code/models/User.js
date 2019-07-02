const {model, Schema} = require('mongoose')
const plm = require('passport-local-mongoose')

const UserSchema = new Schema({
username: String,
password: String,
role:{
  type: String,
  enum: ['BOSS', 'TA','DEVELOPER'],
  default: 'DEVELOPER'
}
},{
  timestamps: true,
  versionKey: false
})

UserSchema.plugin(plm, {usernameField:'username'})

module.exports = model('User',UserSchema)


