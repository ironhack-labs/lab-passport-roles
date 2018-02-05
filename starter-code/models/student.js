const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const studentSchema = new Schema({
  username: String,
  password: String,

  facebookID: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;