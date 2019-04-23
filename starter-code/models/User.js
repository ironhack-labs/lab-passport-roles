const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true
  },
  role: {
    type: String,
    require: true,
    enum: ['The Boss', 'Developer', 'TA']
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