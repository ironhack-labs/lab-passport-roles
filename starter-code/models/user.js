const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  name: String,
  familyName: String,
  role: {
   type: String,
   enum : ['BOSS', 'DEVELOPPER', 'TA'],
   default : 'BOSS'
 },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }

});


const User = mongoose.model("User", userSchema);
module.exports = User;
