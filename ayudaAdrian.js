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
    // add a role here
    role: {
      type: String,
      enum: ['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST'],
      defatul: 'GUEST'
    }
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;


const avatarSchema = new Schema({
    name: {type: String},
    occupation: {type: String},
    catchPhrase: {type: String},
    avatarHead: {type: String},
    avatarEyes: {type: String},
    avatarHair: {type: String},
    avatarBody: {type: String}
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
}
)
