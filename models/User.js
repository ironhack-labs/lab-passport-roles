const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportLocal = require('passport-local-mongoose')

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  hash: String,
  role: {type: String, enum: ["Boss", "Developer", "TA", "Student"],
default: "TA"
}
},{
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

//posibilidad de utilizar metodos de passport
userSchema.plugin(passportLocal);

const User = mongoose.model("User", userSchema);
module.exports = User;