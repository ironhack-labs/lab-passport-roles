const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({


  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,

  },

  role: {
    type: String,
    enum: ["BOSS", "DEVELOPER", "TA"],

  }
}, {
  timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User