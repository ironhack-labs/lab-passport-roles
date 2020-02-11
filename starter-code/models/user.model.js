const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: String,
  role: {
    type: String,
    enum: ['Boss', 'Developer', 'TA', 'Student'],
    default: 'Student'
  },
  facebookId: 'String'
}, {
  timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User