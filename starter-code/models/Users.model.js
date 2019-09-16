const mongoose = require ("mongoose")
const Schema = mongoose.Schema

const usersSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ["BOSS", "DEVELOPER", "TA"]
  }
})

const Users = mongoose.model('Users', usersSchema)

module.exports = Users
