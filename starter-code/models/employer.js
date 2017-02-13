/*jshint esversion:6 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employerSchema = new Schema({
  username: String,
  name: String,
  familyName: String,
  password: String,
  owner: Schema.Types.ObjectId,
  role: {
    type: String,
    enum: ['Developer', 'TA'],
    default: 'Developer'
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Employer = mongoose.model("Employer", employerSchema);
module.exports = Employer;
