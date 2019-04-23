const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        email: String,
        rol: {
          type: String,
          enum: ['BOSS', 'DEVELOPER', 'TA']
        }
      },
      {
        timestamps: true,
        versionKey: false
      }
    )
    
    userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })
    module.exports = mongoose.model('User', userSchema)