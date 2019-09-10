const { Schema, model } = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema(
  {
    userName: String,
    role: {
      type: String,
      enum: ['BOSS', 'DEVELOPER', 'TA', 'ALUMNI'],
      default: 'ALUMNI'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

userSchema.plugin(PLM, { usernameField: 'userName' })
module.exports = model('User', userSchema)
