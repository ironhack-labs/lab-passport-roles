const mongoose=require('mongoose');
const Schema =mongoose.Schema;
const TYPES    = require('./roles');

const userSchema = new Schema ({
  username: String,
  name : String,
  familyName : String,
  password: String,
  role: { type: String, enum: TYPES},
  facebookID: String
},
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User= mongoose.model("User",userSchema);
module.exports = User;
