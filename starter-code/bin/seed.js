const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ironhack-bureau')
  .then(() => User.create({username: 'Boss', password: bcrypt.hashSync('1', bcrypt.genSalt(10)), role: 'Boss'}))
  .then(() => mongoose.connect.close());