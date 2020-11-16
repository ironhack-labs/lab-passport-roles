const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profileImg: {
      type: String,
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRaQSy5ci-5Y4A_xTOtHIQ4myI5LCgwks5weg&usqp=CAU'
    },
    description: {
      type: String
    },
    facebookId: {
      type: String
    },
    role: {
      type: [ String ],
      enum: [ 'BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST' ],
      default: 'GUEST'
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;