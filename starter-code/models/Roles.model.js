const mongoose = require ("mongoose")
const Schema = mongoose.Schema

const rolesSchema = new Schema({
  role: {
    type: String,
    enum: ["BOSS", "DEVELOPER", "TA"]
  }
})

const Roles = mongoose.model('Roles', rolesSchema)

module.exports = Roles
