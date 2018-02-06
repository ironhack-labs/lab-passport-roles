const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  startingDate: Date,
  endDate: String,
  level: String,
  available:Boolean
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Course = mongoose.model("User", userSchema);

module.exports = Course;