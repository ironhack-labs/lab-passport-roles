const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userFBSchema = new Schema({
  username: String,
  password: String,
  facebookID: String,
  googleID: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const UserFB = mongoose.model("UserFB", userFBSchema);

module.exports = UserFB;
