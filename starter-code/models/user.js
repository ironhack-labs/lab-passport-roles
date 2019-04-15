const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: {type: String,
    default : 'Ironhack'
  },
  role: {
    type: String,
    enum : ['BOSS', 'Developer', 'TA'],
    default : 'TA'
  },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);




module.exports = User;