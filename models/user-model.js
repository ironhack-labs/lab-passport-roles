const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  encryptedPassword: {type: String, required: true},
  role: {
    type: String,
    enum: ["boss", "developer", "Ta"],
    default: "Ta"
  }

});

userSchema.virtual("isAdmin").get( function() {
  return this.role === "boss" ;
});

userSchema.virtual("canUpdate").get( function() {
  return this.name === req.user.name || this.role === "boss";
});


const User = mongoose.model("User", userSchema);

module.exports= User;