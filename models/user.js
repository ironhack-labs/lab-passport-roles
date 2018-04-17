const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  rol: {
    boss: {
      type: Boolean,
      default: false
    },
    ta: {
      type: Boolean,
      default: false
    },
    dev: {
      type: Boolean,
      default: true
    },
  }
}, 
{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;