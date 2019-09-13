const { Schema, model } = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema(
  {
    name: String,
    lastName: String,
    email: String,
    role: {
      type: String,
      enum: ['BOSS', 'TA', 'STUDENT'],
      default: 'STUDENT'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

userSchema.plugin(PLM, { usernameField: 'email' })
module.exports = model('User', userSchema)
