const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  role: {
    type: String,
    enum: ['Boss', 'Developer', 'TA']
  },

  encryptedPassword: {type: String}
}, {
  timestamps: true
});


userSchema.virtual('isBoss').get(function() {
  return this.role == "Boss";
});

const User = mongoose.model("User", userSchema);

module.exports = User;