const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
    role: {type: String, enum: ['Boss', 'Developer', 'TA']}
})

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;