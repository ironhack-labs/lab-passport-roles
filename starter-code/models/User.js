const {model, Schema} = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema(
  {
    username: String,
    password: String,
    role: {
      type: String,
      enum: ['Developer', 'TA', 'Boss'],
      default: 'Developer'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

UserSchema.plugin(passportLocalMongoose, {usenameField: 'username'})

module.exports = model('User', UserSchema)