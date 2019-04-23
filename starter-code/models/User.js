const mongoose              = require('mongoose')
const { Schema }            = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
  email: String,
  role: {
    type: String,
    enum: ['BOSS','DEVELOPER','TA','MUGGLE']
  }
},{
  timestamps:true,
  versionKey: false
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('User', userSchema)