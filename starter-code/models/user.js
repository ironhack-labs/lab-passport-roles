
const mongoose = require('mongoose');
const passportlocalmongoose = require("passport-local-mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({

  username: String,
  password: String,
  name: String,
  role: String
}, {
  timestamps: { 
    createdAt: "created_at", 
    updatedAt: "updated_at" 
  },
});

userSchema.plugin(passportlocalmongoose);
const User = mongoose.model('User', userSchema);
module.exports = User;