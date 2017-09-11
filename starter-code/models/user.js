const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: {type: String},
  password: {type: String},
  name: {type: String},
  familyName: {type: String},
  role: {type: String}
  },
  {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {user: User};
