const mongoose = require ("mongoose")
const findOrCreate = require('mongoose-findorcreate')
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
  },
  githubId: String
})

usersSchema.plugin(findOrCreate)

const Users = mongoose.model('Users', usersSchema)

module.exports = Users
