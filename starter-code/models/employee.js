const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  username: String,
  name: String,
  familyName: String,
  password: String,
  role: {
   type: String,
   enum : ['Boss', 'Developer', 'TA'],
   default : 'Boss'
 },
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
