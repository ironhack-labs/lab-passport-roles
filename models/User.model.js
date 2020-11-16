const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    profileImg: {
        type: String
    },
    description: {
        type: String
    },
    facebookId: {
        type: String
    },
    role: {
        type: String,
        enum: ['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST'],
        default: 'GUEST'
    }
    
    // add a role here
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
