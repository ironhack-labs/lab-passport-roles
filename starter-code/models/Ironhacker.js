const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const employeeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true
    },
    email: {
      type: String,
      require: true,
      unique: true
    },
    role: {
      type: String,
      enum: ['Developer', 'TA']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

employeeSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('employees', employeeSchema)