const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const employeeSchema = new mongoose.Schema(
  {
    email: String,
    role: {
      type: String,
      enum: ['DEVELOPER', 'TA']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

employeeSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('employees', employeeSchema) 