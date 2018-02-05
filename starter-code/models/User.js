const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  name: String,
  familyName: String,
  role: {
    type: String,
    enum : ['Boss', 'TA', 'Developer'],
    default : 'Developer'
    }
  }, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  
});

const User = mongoose.model("User", UserSchema);

module.exports = User;