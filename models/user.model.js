const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    name: String,
    password: String,
    profileImg: {
      type: String,
      default: 'img'
    },
    description: {
      type: String,
      default: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel commodi ad ducimus placeat maiores nulla. Ut dignissimos, rem dolore earum at saepe, omnis doloremque, explicabo corporis nisi nostrum esse sequi.'
    },
    facebookId: {
      type: String,
      default: 'ADAC$"Faf237d6dg2367dg2d72g37dg2aSDAWDQD'
    },
    role: {
        type: String,
        enum: ['BOSS', 'DEV', 'TA','STUDENT','GUEST'],
        default: 'GUEST'
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;