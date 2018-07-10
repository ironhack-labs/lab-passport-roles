const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const employeeSchema = new Schema({
    name: String,
    role: [{
      type: String,
      enum : ['Boss', 'Developer', 'TA'],
    }]
  }, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  });

const Employee = mongoose.model("Emloyee", employeeSchema);

module.exports = Employee;