const {Schema, model} = require('mongoose')
const plm = require('passport-local-mongoose')

const userSchema = new Schema({
  name: String,
  lastName: String,
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['DEVELOPER', 'TA', 'BOSS'],
    default: 'DEVELOPER'
  }
}, {
  timestamps: true,
  versionKey: false
})

userSchema.plugin(plm, {usernameField: 'email'})
module.exports = model('User', userSchema)