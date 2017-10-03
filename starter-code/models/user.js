const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userschema = new Schema({
  username: String,
  password: String
}, {
  timestamps: {createdAt: "created_at", updatedAt:"updated_at"}

});
const UserSchema = mongoose.Schema({
  role: {
    type: String,
    enum :['BOSS','Developer','TA'],
    default : 'BOSS'
  },
});


const User     = mongoose.model("user",userschema);
module.exports = User;
