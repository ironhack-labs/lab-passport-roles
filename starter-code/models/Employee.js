const { Schema, model } = require('mongoose')

const employeeSchema = new Schema(
  {
    userName: String,
    role: {
      type: String,
      enum: ['BOSS', 'DEVELOPER', 'TA'],
      default: 'TA'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = model('Employee', employeeSchema)
