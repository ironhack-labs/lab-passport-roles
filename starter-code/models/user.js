const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const user = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum : ['Developer', 'TA', 'Boss'],
    default : 'Developer'
  }
},{
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User= mongoose.model("User",user);

module.exports = User;
