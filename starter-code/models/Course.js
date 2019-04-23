const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const coursesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true
    },
    schedule: {
      type: String,
      enum: ['Part Time', 'Full Time']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

coursesSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('courses', coursesSchema)