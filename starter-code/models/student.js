const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    username: String,
    name: String,
    familyName: String,
    password: String,
    role:{
      type: String,
      enum: ['Student'],
      default: 'Student'
    },
    facebookID: String
  },{
    timestamps:{
      createdAt: "created_at", 
      updatedAt: "updated_at"
    }
    });

    const Student = mongoose.model("Student", studentSchema)
    module.exports = Student