const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const userSchema = new Schema({
  name: String,
  startingDate: Date,
  endDate: Date,
  level: String,
  available: Boolean
},
{
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})


module.exports = mongoose.model("Course", userSchema)
