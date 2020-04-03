const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String,required:true, unique: true },
    name: String,
    password:{ type: String,required:true},
    profileImg: String,
    description: String,
    facebookId: String,
    accessLevel:{type:String,required:true,enum:['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST'],default:'GUEST'},
    email:String,
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
