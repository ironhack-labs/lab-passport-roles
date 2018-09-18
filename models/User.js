const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const PLM      = require('passport-local-mongoose')

const userSchema = new Schema({
  username: String,
  role: {
      type:String,
      enum:['BOSS', 'TA', 'DEVELOPER'],
      default: 'DEVELOPER'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'upadted_at'
  }
})

userSchema.plugin(PLM, {usernameField: 'username'})
module.exports = mongoose.model('User', userSchema)