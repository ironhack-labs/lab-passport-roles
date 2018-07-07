const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const roleSchema = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ['STUDENT', 'TA', 'DEVELOPER', 'BOSS'],
    default : 'STUDENT'
  },
  facebookID: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Roles = mongoose.model("Roles", roleSchema);

module.exports = Roles;