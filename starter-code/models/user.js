const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  name: String,
  familyName: String
  },
  {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  role: {
    type: String,
    enum : ['Boss', 'Developer', 'TA'],
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {user: User};
