const { Schema, model } = require('mongoose')
//el modelo tiene que funcionar de acuerdo a passpor-local-mongoose
const PLM = require('passport-local-mongoose')
//user pide passport

const userSchema = new Schema(
  {
    name: String,
    lastName: String,
    email: {
      type: String,
      required: true
    }, 
    role: {
      type: String,
      enum: ['BOSS', 'TA', 'STUDENT'],
      default: 'STUDENT'
    }
  },
  {
    timestamps: true,
  }
)

userSchema.plugin(PLM, { usernameField: 'email' })
module.exports = model('User', userSchema)
