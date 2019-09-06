require('dotenv').config();

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const User = require('../models/User');

const saltRounds = 10;

const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(process.env.BOSS_PASSWORD, salt);

mongoose.connect('mongodb://localhost/lab-passport-roles');

const admin = {
  name: 'Admin',
  username: 'admin',
  password: hash,
  role: 'Boss',
};

User.create(admin, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`Created ${admin.username}!`);
  mongoose.connection.close();
});
