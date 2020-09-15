const faker = require('faker')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    name: String,
    password: String,

    profileImg: {

      type: String,
      default: faker.image.people(100, 100)

    },
    description: String,
    facebookId: String,

    role: {

      type: String,
      enum: ['boss', 'dev', 'ta', 'student', 'guest'],
      default: 'guest'

    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
