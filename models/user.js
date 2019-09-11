'use strict';

// User model goes here
const  mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: [ 'user', 'Boss', 'Developer', 'TA' ],
    default: 'user'
  }
});

const signInStatic = require('./sign-in-static');
const addNewUser = require('./add-user-static');

schema.statics.signIn = signInStatic;
schema.statics.addNewUser = addNewUser;

schema.statics.findByEmail = function(email) {
  const Model = this;
  return Model.findOne({ email })
    .then(user => {
      return Promise.resolve(user);
    })
    .catch(error => {
      return Promise.reject(error);
    });
};

const User = mongoose.model('User', schema);

module.exports = User;