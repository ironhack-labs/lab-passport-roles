const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    name: String,
    password: String,
    profileImg: String,
    description: String,
    facebookId: String,
    role: {
      type: String,
      required: true,
      enum: ['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST'],
      default: 'GUEST'
    }
  },
  {
    timestamps: true
  }
);

//const User = 

module.exports = mongoose.model('User', userSchema);
