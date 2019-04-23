const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true
  },
  rol: {
    type: String,
    require: true,
    enum: ['BOSS', 'DEVELOPER', 'TA']
  }
},
{
  timestamps: true,
  versionKey: false
})
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'username'
})

module.exports = mongoose.model('User', userSchema)