const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const employeeSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['Boss', 'Developer', 'TA'],
    default: 'Developer',
  },
}, {
  timestamps: true,
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;