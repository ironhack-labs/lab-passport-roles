const { model, Schema } = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema(
  {
    name: String,
    lastName: String,
    email: String,
    role: {
      type: String,
      enum: ['STUDENT', 'TA', 'BOSS'],
      default: 'STUDENT'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = model('User', userSchema)