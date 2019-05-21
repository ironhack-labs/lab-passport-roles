const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  // owner: Schema.Types.ObjectId,
  role: {
    type: String,
    enum: ['Boss', 'Developer', 'TA'],
    default: 'Developer'
  }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  });

const User = mongoose.model("User", userSchema)

module.exports = User