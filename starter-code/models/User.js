const {
  Schema,
  model
} = require('mongoose')
const PLM = require('passport-local-mongoose') //solo estamos abreviando passport local mongoose

const userSchema = new Schema({
  email: String,
  name: String,
  lastname: String,
  role: {
    type: String,
    enum: ['BOSS', 'DEVELOPER', 'TA'],
    default: 'DEVELOPER'
  }
}, {
  timestamps: true,
  versionKey: false
})
//agregar anabolicos (passport local, aquí estamos inyectando  )
userSchema.plugin(PLM, {
  usernameField: 'email'
})

module.exports = model('User', userSchema)