// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const userSchema = new Schema({
//   username: String,
//   password: String,
//   role: {
//     type: String,
//     enum: ['BOSS', 'DEVELOPER', 'TA', 'GUEST'],
//     default: 'GUEST'
//   }
// })

// const User = mongoose.model('User', userSchema)

// module.exports = User

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
        enum: ['BOSS', 'GUEST', 'DEV', 'TA'],
        default: 'GUEST'
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;