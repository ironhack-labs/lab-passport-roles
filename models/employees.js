const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const employeeSchema = new Schema({
  username: String,
  password: String,
  googleID: String,
  role: {
  type: String,
  enum : ['TA', 'DEVELOPER'],
  default : 'TA'
}
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;