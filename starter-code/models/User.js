const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PLM = require('passport-local-mongoose')

const userSchema = new Schema({
  name: String,
  email: String, 
  picture: String, 
  role: {
    type: String,
    enum: ['GM', 'Alumni', 'TA'],
    default: 'Alumni'
  }
}, {
  timestamps: true,
    versionKey: false
  })

userSchema.plugin(PLM, {usernameField:  'email'})
module.exports = mongoose.model('User', userSchema)